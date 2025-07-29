const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./mongodb.js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

dotenv.config();

const app = express();

// ----- Middleware -----
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ----- Passport Local Strategy -----
passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const db = await connectDB();
        const user = await db.collection('students').findOne({ username: username.toLowerCase() });
        if (!user) return done(null, false, { message: 'Incorrect username.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ----- API Routes -----
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

// ----- Serve React build in production only -----
const CLIENT_DIST_PATH = path.join(__dirname, '../client/dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(CLIENT_DIST_PATH));
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST_PATH, 'index.html'));
  });
}

// Mongo Connection
app.get('/unique', async (req, res) => {
  try {
    const db = await connectDB();
    const { username, email, phone } = req.query;
    const existingUser = await db.collection('students').findOne({
      $or: [{ username }, { email }, { phone }]
    });
    const isUnique = !existingUser;
    res.json({ unique: isUnique });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Register
app.post('/register', async (req, res) => {
  const db = await connectDB();
  const newUser = req.body;
  try {
    const plainpassword = newUser.password;
    const hashedPassword = await bcrypt.hash(plainpassword, 13);
    newUser.password = hashedPassword;
    newUser.username = newUser.username.toLowerCase();
    newUser.email = newUser.email.toLowerCase();
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  await db.collection('students').insertOne(newUser);
  res.status(201).json(newUser);
});

// Login with Passport
app.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (!user) return res.status(401).json({ error: info.message });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.status(200).json({ message: 'Login successful', token });
  })(req, res, next);
});

// JWT Token Check
app.post('/checktoken', (req, res) => {
  let token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({
      message: 'Token is valid',
      token: token,
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

app.get('/courses', async (req, res) => {
  try {
    const db = await connectDB();
    const courses = await db.collection('courses').find().toArray();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/signedupcourses', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const db = await connectDB();

    
    await db.collection('students').updateOne(
      { userId },
      { $addToSet: { courses: courseId } }
    );

   
    await db.collection('courses').updateOne(
      { courseid: courseId },
      { $addToSet: { students: userId } }
    );

    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/createcourses', async (req, res) => {
  const courseData = req.body;

  try {
    const db = await connectDB();
    await db.collection('courses').insertOne(courseData);
    res.status(201).json({ message: 'Course created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.delete('/deletecourses', async (req, res) => {
  const { courseId } = req.body; 
  try {
    const db = await connectDB();
    await db.collection('courses').deleteOne({ courseid: courseId });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.delete('/removecourses', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const db = await connectDB();

   
    await db.collection('students').updateOne(
      { userId },
      { $pull: { courses: courseId } }
    );

   
    await db.collection('courses').updateOne(
      { courseid: courseId },
      { $pull: { students: userId } }
    );

    res.status(200).json({ message: 'Course removed successfully' });
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
    newUser.courses = []; 
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

app.get('/students', async (req, res) => {
  try {
    const db = await connectDB();
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/user', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    try {
      const db = await connectDB();
      const user = await db.collection('students').findOne({ username: decoded.username });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.post('/userchange', async (req, res) => {
  
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
   
    try {
      const db = await connectDB();
      const { field, value } = req.body;

      const update = {};
      if (field === 'password') {
        const hashed = await bcrypt.hash(value, 13);
        update.password = hashed;
      } else {
        update[field] = value;
      }
      const result = await db.collection('students').findOneAndUpdate(
        { username: decoded.username },
        { $set: update },
        { returnDocument: 'after' }
      );

      console.log('Received token:', result);
      if (!result) return res.status(404).json({ error: 'User not found' });

      const { password, ...userData } = result;
      return res.json(userData);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.post('/adminuserchange', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    try {
      const db = await connectDB();
      const { userId, field, value } = req.body;

      const update = {};
      if (field === 'password') {
        const hashed = await bcrypt.hash(value, 13);
        update.password = hashed;
      } else {
        update[field] = value;
      }
      const result = await db.collection('students').findOneAndUpdate(
        { userId },
        { $set: update },
        { returnDocument: 'after' }
      );

      if (!result) return res.status(404).json({ error: 'User not found' });

      const { password, ...userData } = result;
      return res.json(userData);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.post('/addcoursetostudent', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    try {
      const db = await connectDB();
      const { username, courseid } = req.body;

     
      const studentResult = await db.collection('students').findOneAndUpdate(
        { username },
        { $addToSet: { courses: courseid } },
        { returnDocument: 'after' }
      );

      if (!studentResult.value) return res.status(404).json({ error: 'Student not found' });

      await db.collection('courses').updateOne(
        { courseid },
        { $addToSet: { students: username } }
      );

      res.status(200).json({ message: 'Course and student updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.post('/addstudenttocourse', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    try {
      const db = await connectDB();
      const { username, courseid } = req.body;


      const student = await db.collection('students').findOne({ username });
      if (!student) return res.status(404).json({ error: 'Student not found' });

   
      await db.collection('students').updateOne(
        { username },
        { $addToSet: { courses: courseid } }
      );

     
      await db.collection('courses').updateOne(
        { courseid },
        { $addToSet: { students: student.userId } }
      );

      res.status(200).json({ message: 'Student added to course successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.delete('/removestudentfromcourse', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    try {
      const db = await connectDB();
      const { username, courseid } = req.body;

      await db.collection('students').updateOne(
        { username },
        { $pull: { courses: courseid } }
      );

      await db.collection('courses').updateOne(
        { courseid },
        { $pull: { students: username } }
      );

      res.status(200).json({ message: 'Course removed from student successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.post('/createstudent', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, async (err) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    try {
      const db = await connectDB();
      const newStudent = req.body;
      newStudent.username = newStudent.username.toLowerCase();
      newStudent.email = newStudent.email.toLowerCase();
      newStudent.courses = [];

      const plainpassword = newStudent.password;
      const hashedPassword = await bcrypt.hash(plainpassword, 13);
      newStudent.password = hashedPassword;

      await db.collection('students').insertOne(newStudent);
      res.status(201).json(newStudent);
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

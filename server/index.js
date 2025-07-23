const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./mongodb.js');
const bcrypt = require('bcrypt');

const app = express();

// ----- Middleware -----
app.use(cors());
app.use(express.json());

// ----- API Routes -----
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

// ----- Serve React build in production only -----
const CLIENT_DIST_PATH = path.join(__dirname, '../client/dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(CLIENT_DIST_PATH));

  // Catch-all *after* API routes & static
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST_PATH, 'index.html'));
  });
}

// Mongo Connection

app.get('/unique', async (req, res) => {
  try {
    const db = await connectDB(); // Add this line

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



app.post('/register', async (req, res) => {
  const db = await connectDB();
   const newUser = req.body;
  try { 
   
    const plainpassword = newUser.password;
    const hashedPassword = await bcrypt.hash(plainpassword, 13);
    newUser.password = hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  await db.collection('students').insertOne(newUser);
  res.status(201).json(newUser);
});


  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

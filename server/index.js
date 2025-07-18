const express = require('express');
const cors = require('cors');
const path = require('path');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

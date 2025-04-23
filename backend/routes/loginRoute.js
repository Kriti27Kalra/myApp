// backend/routes/loginRoute.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // make sure this is the correct path

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Use parameterized query to prevent SQL injection
  const query = 'SELECT * FROM consumers WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    res.status(200).json({ message: 'Login successful', user });
  });
});

module.exports = router;

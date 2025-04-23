const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Register route
router.post('/register', (req, res) => {
  const { name, phone, email, password, referCode } = req.body;

  const sql = `INSERT INTO consumers (name, phone, email, password, refer_code) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, phone, email, password, referCode], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Registration failed' });
    }

    return res.status(200).json({ message: 'User registered successfully' });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM consumers WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    // Check if email exists and password matches
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (results[0].password !== password) { // Plain text password comparison
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Success: Password is correct
    res.json({ success: true, message: 'Login successful' });
  });
});


module.exports = router;

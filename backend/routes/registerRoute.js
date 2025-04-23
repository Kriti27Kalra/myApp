const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Register a new user
router.post('/register', (req, res) => {
  const { name, phone, email, password, referCode } = req.body;

  // Print the data received from the frontend
  console.log('User Data:', req.body); // This will print the user data in the backend terminal

  // Check if the email already exists
  const checkEmailQuery = 'SELECT * FROM consumers WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If email exists, send a response
    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // If email doesn't exist, proceed with registration
    const sql = 'INSERT INTO consumers (name, phone, email, password, refer_code) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, phone, email, password, referCode], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Registration failed' });
      }

      // Print the inserted data to the backend terminal
      console.log('Inserted User Data:', { name, phone, email, password, referCode });

      return res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

module.exports = router;

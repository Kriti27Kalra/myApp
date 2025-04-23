const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();  // To load environment variables from .env file

const app = express();
const port = 5000;

// Middleware
app.use(express.json());  // To parse JSON bodies from POST requests
app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL connected successfully !');
});

// POST route to handle user registration
app.post('/api/register', (req, res) => {
  console.log('Received registration request:', req.body);
  
  const { name, phone, email, password, confirmPassword, referCode } = req.body;

  if (!name || !phone || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  console.log("Sanitized registration data:", { name, phone, email, password, confirmPassword, referCode });


  const checkEmailQuery = 'SELECT * FROM consumers WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Email check error:', err);
      return res.status(500).json({ message: 'Server error while checking email', error: err.sqlMessage });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Fallback to null if referCode is empty or undefined
    const referCodeToInsert = referCode || null;

    const insertQuery = 'INSERT INTO consumers (name, phone, email, password, refer_code) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [name, phone, email, password, referCodeToInsert], (err, result) => {
      if (err) {
        console.error('Registration error:', err.sqlMessage);
        return res.status(500).json({ message: 'Registration failed', error: err.sqlMessage });
      }
      console.log('User registered successfully:', result);
      res.status(201).json({ message: 'Registration successful' });
    });
  });
});
// POST route to handle user login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const checkEmailQuery = 'SELECT * FROM consumers WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error while checking email', error: err.sqlMessage });
    }

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

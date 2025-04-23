const mysql = require('mysql2');  // Ensure mysql2 is used
const dotenv = require('dotenv');
dotenv.config();  // Load .env file for configuration

// Create the MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check if the connection is successful
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

module.exports = db;  // Export the connection object

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../config/db');

// Generate random 8-character user ID
const generateUserId = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase(); // e.g., "A1B2C3D4"
};

// Register route and sanitization
router.post(
  '/register',
  [
    body('name').trim().escape(),
    body('phone').trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('referCode').optional().trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Log validation errors for debugging
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());  // Log errors
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, phone, email, password, referCode } = req.body;
    console.log('Received User Data:', { name, phone, email, password, referCode });

    try {
      // Check if email already exists
      const [existingEmail] = await db.promise().query('SELECT * FROM consumers WHERE email = ?', [email]);
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Generate unique user ID
      let userId = generateUserId();
      while (true) {
        const [existingUser] = await db.promise().query('SELECT * FROM consumers WHERE user_id = ?', [userId]);
        if (existingUser.length === 0) break;
        userId = generateUserId();
      }

      // Check referCode validity and get referring user ID
      let referredByUserId = null;
      if (referCode) {
        const [referrer] = await db.promise().query(
          'SELECT user_id FROM consumers WHERE refer_code = ?',
          [referCode]
        );

        if (referrer.length === 0) {
          return res.status(400).json({ message: 'Invalid refer code' });
        }

        referredByUserId = referrer[0].user_id;
      }

      // Insert new user
      const insertQuery = ` 
        INSERT INTO consumers (user_id, name, phone, email, password, refer_code, referred_by_user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.promise().query(insertQuery, [userId, name, phone, email, password, referCode, referredByUserId]);

      // After inserting the new user into the database, update refer_count
      if (referCode) {
        const referCountQuery = 'UPDATE consumers SET refer_count = refer_count + 1 WHERE refer_code = ?';
        db.query(referCountQuery, [referCode], (err, result) => {
          if (err) {
            console.error('Error updating refer_count:', err);
          } else {
            console.log('Refer count updated for refer code:', referCode);
          }
        });
      }

      console.log('Inserted User:', { userId, name, phone, email, password, referCode, referredByUserId });

      return res.status(200).json({
        message: 'User registered successfully',
        userId,
        referredByUserId,
        referCode
      });
    } catch (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ message: 'Registration failed' });
    }
  }
);

module.exports = router;

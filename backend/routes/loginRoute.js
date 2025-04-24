const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const loginQuery = 'SELECT * FROM consumers WHERE email = ? AND password = ?';

  db.query(loginQuery, [email, password], (err, result) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result[0];

    if (user.referred_by_user_id) {
      // Get referrer's refer code
      const refQuery = 'SELECT refer_code FROM consumers WHERE user_id = ?';
      db.query(refQuery, [user.referred_by_user_id], (err, refResult) => {
        if (err) {
          console.error('Error fetching referrer details:', err);
          return res.status(500).json({ message: 'Error fetching referrer info' });
        }

        const referredByReferCode = refResult.length > 0 ? refResult[0].refer_code : null;

        return res.status(200).json({
          message: 'Login successful',
          user: {
            userId: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            referCode: user.refer_code,
            referredByUserId: user.referred_by_user_id,
            referredByReferCode: referredByReferCode,
          }
        });
      });
    } else {
      return res.status(200).json({
        message: 'Login successful',
        user: {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          referCode: user.refer_code,
        }
      });
    }
  });
});

module.exports = router;

const express = require('express');
const db = require('../config/db'); // Make sure to use your db connection
const router = express.Router();

// A simple middleware to simulate authentication
const authenticateUser = (req, res, next) => {
  const userId = req.headers['user-id']; // You can modify this based on your authentication method (JWT, session, etc.)
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.userId = userId; // Assuming you store the user ID in the request object
  next();
};

// Dashboard route with user information
router.get('/dashboard', authenticateUser, async (req, res) => {
  const userId = req.userId;

  try {
    // Fetch user details based on userId
    const [userDetails] = await db.promise().query(
      'SELECT user_id, name, refer_code, referred_by_user_id FROM consumers WHERE user_id = ?',
      [userId]
    );

    if (userDetails.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, refer_code, referred_by_user_id } = userDetails[0];

    // Fetch the total number of users referred by this user
    const [referCount] = await db.promise().query(
      'SELECT COUNT(*) AS referred_count FROM consumers WHERE referred_by_user_id = ?',
      [userId]
    );

    const referredCount = referCount[0].referred_count;

    // Return the user data and referral statistics
    return res.status(200).json({
      message: 'Welcome to your dashboard',
      userId,
      name,
      referCode: refer_code,
      referredByUserId: referred_by_user_id,
      referredCount,
    });
  } catch (err) {
    console.error('Error fetching user dashboard:', err);
    return res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;

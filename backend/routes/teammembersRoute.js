const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Fetch team members by refer code
router.get('/teammembers/:referCode', async (req, res) => {
    const referCode = req.params.referCode;

    // Log only for debugging, you can remove later
    console.log('Refer Code:', referCode);

    try {
      // Query to fetch team members based on refer code
      const [teamMembers] = await db.promise().query(
        "SELECT user_id, name, email FROM consumers WHERE refer_code = ?",
        [referCode]
      );

      if (teamMembers.length === 0) {
        return res.status(404).json({ message: 'No team members found for this refer code' });
      }

      return res.status(200).json({ teamMembers });
    } catch (err) {
      console.error('Error fetching team members:', err);
      return res.status(500).json({ message: 'Error fetching team members' });
    }
});

module.exports = router;

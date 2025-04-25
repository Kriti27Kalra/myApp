const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.put('/edit-profile', (req, res) => {
  const { id, name, phone } = req.body;

  if (!id || !name || !phone) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = 'UPDATE consumers SET name = ?, phone = ? WHERE id = ?';
  db.query(query, [name, phone, id], (err, result) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Failed to update profile.' });
    }

    res.json({ message: 'Profile updated successfully.' });
  });
});

module.exports = router;

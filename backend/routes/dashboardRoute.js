const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the dashboard' });
});

module.exports = router;

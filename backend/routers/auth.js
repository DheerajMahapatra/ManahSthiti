// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ Path check kar lena

// ✅ Check if email already exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
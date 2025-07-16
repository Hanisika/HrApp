const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Firm = require('../model/firm');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase(), password: password.trim() });
    if (!user) return res.json({ success: false, message: 'Invalid credentials' });

    const firm = await Firm.findOne({ hrEmail: user.email });
   res.json({
  success: true,
  role: user.role,
  name: user.name,
  hrEmail: user.email, 
  firmName: user.firmName,
});

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

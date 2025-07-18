const express = require('express');
const router = express.Router();
const Employee = require('../model/Employee');

router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  console.log('📥 Login Request Received');

  if (!email || !password) {
    console.log('⚠️ Missing Email or Password');
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  email = email.trim().toLowerCase();
  password = password.trim();

  console.log('🧹 Trimmed Email:', email);
  console.log('🧹 Trimmed Password:', password);

  try {
    const user = await Employee.findOne({ email, password });

    if (!user) {
      console.log('❌ User not found. Showing all DB users for debug:');
      const users = await Employee.find({}, { email: 1, password: 1, role: 1 });
      console.table(users);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('✅ Login Success:', user.email, '| Role:', user.role);

    res.json({
      success: true,
      role: user.role,
      name: user.name,
      hrEmail: user.email,
      firmName: user.firmName || '', // just in case
    });
  } catch (err) {
    console.error('❌ Server Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

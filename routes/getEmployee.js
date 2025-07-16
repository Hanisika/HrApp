// routes/getEmployee.js
const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.post('/', async (req, res) => {
   console.log("📩 Received get-employee request:", req.body);
  const { hrEmail} = req.body;

  try {
    // Find HR user
    const hr = await User.findOne({ email: hrEmail, role: 'hr' });
    if (!hr) {
      return res.status(404).json({ success: false, message: 'HR not found' });
    }

    // Get employees under same firm
    const employees = await User.find({
      firmName: hr.firmName,
      role: 'employee',
    });

    res.json({ success: true, employees });
  } catch (error) {
    console.error("❌ Get employee error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

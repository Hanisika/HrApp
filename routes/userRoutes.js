// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../model/Employee');

// Get all employees under same firm
router.get('/get-employees/:firmName', async (req, res) => {
  try {
    const { firmName } = req.params;
    const employees = await User.find({ firmName, role: 'employee' });
    res.json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

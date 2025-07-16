const express = require('express');
const router = express.Router();
const User = require('../model/user');

// POST /add-employee/
router.post('/', async (req, res) => {
  try {
    const {
      name, email, phone, joiningDate,
      department, designation, firmName, role
    } = req.body;

    if (!name || !email || !phone || !joiningDate || !department || !designation || !firmName) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Employee already exists.' });
    }

    const parsedDate = new Date(joiningDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ success: false, message: 'Invalid joining date.' });
    }

    const newUser = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      joiningDate: parsedDate,
      department,
      designation,
      firmName,
      role: role || 'employee',
      password: 'default123'
    });

    await newUser.save();
    console.log('✅ Employee saved:', newUser.email);
    return res.status(200).json({ success: true, message: 'Employee added successfully' });

  } catch (err) {
    console.error('❌ Error in add-employee route:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

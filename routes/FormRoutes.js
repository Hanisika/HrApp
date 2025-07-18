// routes/FormRoutes.js

const express = require('express');
const router = express.Router();
const Employee = require('../model/Employee'); // Make sure the path is correct

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      joiningDate,
      department,
      designation,
      firmName,
    } = req.body;

    console.log('🟨 Full Employee Payload:', req.body);
    console.log('🔍 Fields:', { name, email, phone, joiningDate, department, designation, firmName });

    if (!name || !email || !phone || !joiningDate || !department || !designation || !firmName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const parsedDate = new Date(joiningDate);

    const newEmployee = new Employee({
      name,
      email: email.toLowerCase(),
      phone,
      joiningDate: parsedDate,
      department,
      designation,
      firmName:'mytech',
      password: '123456',
    });

    await newEmployee.save();
    res.status(201).json({ success: true, message: 'Employee added successfully' });

  } catch (error) {
    console.error('❌ Error adding employee:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;

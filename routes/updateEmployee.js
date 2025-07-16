const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, joiningDate } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        joiningDate
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Employee not found' });

    res.json({ success: true, message: 'Employee updated successfully', updated });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

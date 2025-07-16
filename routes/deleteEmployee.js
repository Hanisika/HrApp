const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ success: false, message: 'Employee not found' });

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

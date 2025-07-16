const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: String, required: true },
  punchIn: { type: String },
  punchOut: { type: String },
  duration: { type: String },
  punchInLocation: { type: String },   // ✅ MUST BE STRING
  punchOutLocation: { type: String },  // ✅ MUST BE STRING
});

module.exports = mongoose.model('Attendance', attendanceSchema);

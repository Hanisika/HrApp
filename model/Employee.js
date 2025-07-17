const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  department: String,
  designation: String,
  joiningDate: Date,
  managerEmail: String,
  teamId: mongoose.Schema.Types.ObjectId,
  firmName: String,
});

module.exports = mongoose.model('Employee', employeeSchema);

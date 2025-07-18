const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
 name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  firmName: { type: String, required: true },
  password: { type: String, default: '123456' },
  role: { type: String, default: 'employee' },
  team: { type: String, default: null },
  projectName: { type: String, default: null },
  reportingManager: { type: String, default: null },
  projectUpdateLink: { type: String, default: null }
}, { collection: 'Employee' });

module.exports = mongoose.model('Employee', employeeSchema);

// model/firm.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  joiningDate: Date,
  role: {
    type: String,
    default: 'employee'
  }
}, { _id: true });

const designationSchema = new mongoose.Schema({
  designationTitle: String,
  employees: [employeeSchema]
});

const departmentSchema = new mongoose.Schema({
  departmentName: String,
  designations: [designationSchema]
});

const firmSchema = new mongoose.Schema({
  firmName: { type: String, required: true },
  hrEmail: { type: String, required: true, unique: true },
  departments: [departmentSchema]
}, {
  timestamps: true,
  collection: 'firms'
});

module.exports = mongoose.model('Firm', firmSchema);

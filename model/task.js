const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: String, required: true }, // employee email or userId
  assignedBy: { type: String, required: true }, // HR or manager email
  firmName: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
},  collection='task')

module.exports = mongoose.model('Task', taskSchema);

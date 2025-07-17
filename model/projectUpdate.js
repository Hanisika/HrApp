const mongoose = require('mongoose');
const projectUpdateSchema = new mongoose.Schema({
  employeeEmail: String,
  projectId: mongoose.Schema.Types.ObjectId,
  updateLink: String,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProjectUpdate', projectUpdateSchema);
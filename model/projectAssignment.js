const mongoose = require('mongoose');
const projectAssignmentSchema = new mongoose.Schema({
  managerEmail: String,
  projectId: mongoose.Schema.Types.ObjectId,
  projectName: String,
  teamId: mongoose.Schema.Types.ObjectId,
  teamName: String,
  employees: [
    {
      name: String,
      email: String,
    },
  ],
  assignedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProjectAssignment', projectAssignmentSchema);


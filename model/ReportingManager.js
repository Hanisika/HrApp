const mongoose = require('mongoose');
const reportingManagerSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  teams: [
    {
      teamId: mongoose.Schema.Types.ObjectId,
      teamName: String,
      employees: [
        {
          name: String,
          email: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model('ReportingManager', reportingManagerSchema);

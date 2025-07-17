const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  firmName: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['hr', 'manager', 'employee'], 
    default: 'employee' 
  },
  password: { type: String, required: true },

  // 🔗 Reference to team (if applicable)
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

module.exports = mongoose.model('User', userSchema);

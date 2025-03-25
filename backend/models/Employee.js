const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Employee', employeeSchema);
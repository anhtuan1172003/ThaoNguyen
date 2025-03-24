const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
});

module.exports = mongoose.model('Admin', adminSchema);
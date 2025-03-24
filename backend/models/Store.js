const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: String,
  licenseKey: String,
  licenseStatus: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active'
  },
  adminAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

module.exports = mongoose.model('Store', storeSchema);
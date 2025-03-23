const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  machineType: String,
  errorDescription: String,
  initialStatus: String,
  price: Number,
  orderStatus: {
    type: String,
    enum: ['not completed', 'completed'],
    default: 'not completed'
  },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  inChargeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Order', orderSchema);
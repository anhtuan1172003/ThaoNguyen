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
  machineType: {
    type: String,
    required: true
  },
  errorDescription: {
    type: String,
    required: true
  },
  initialStatus: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['completed', 'not completed'],
    default: 'not completed'
  },
  inChargeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Order', orderSchema);
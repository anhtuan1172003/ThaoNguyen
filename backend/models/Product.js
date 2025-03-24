const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  status: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
});

module.exports = mongoose.model('Product', productSchema);
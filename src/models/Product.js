const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'general' },
  unitPrice: { type: Number, required: true, min: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);

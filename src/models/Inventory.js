const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  minimumQuantity: { type: Number, required: true, min: 0, default: 0 },
  location: { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inventory', inventorySchema);

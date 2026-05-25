const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['inbound', 'outbound', 'adjustment'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  reason: { type: String, default: '' },
  warehouse: { type: String, required: true, trim: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Movement', movementSchema);

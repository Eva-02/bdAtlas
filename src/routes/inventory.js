const express = require('express');
const Inventory = require('../models/Inventory');
const { requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.productId) filters.productId = req.query.productId;
  if (req.query.warehouse) filters.warehouse = req.query.warehouse;
  if (req.query.location) filters.location = req.query.location;
  const inventory = await Inventory.find(filters).populate('productId');
  res.json(inventory);
});

router.get('/:id', asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id).populate('productId');
  if (!inventory) {
    return res.status(404).json({ error: 'Registro de inventario no encontrado' });
  }
  res.json(inventory);
}));

router.post('/', requireRole(['admin']), asyncHandler(async (req, res) => {
  const { productId, warehouse, quantity, minimumQuantity, location } = req.body;
  if (!productId || !warehouse || quantity == null || minimumQuantity == null) {
    return res.status(400).json({ error: 'productId, warehouse, quantity y minimumQuantity son obligatorios' });
  }
  const inventory = await Inventory.create({ productId, warehouse, quantity, minimumQuantity, location });
  res.status(201).json(inventory);
});

router.put('/:id', requireRole(['admin']), asyncHandler(async (req, res) => {
  const updates = req.body;
  const inventory = await Inventory.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!inventory) {
    return res.status(404).json({ error: 'Registro de inventario no encontrado' });
  }
  res.json(inventory);
}));

router.delete('/:id', requireRole(['admin']), asyncHandler(async (req, res) => {
  const inventory = await Inventory.findByIdAndDelete(req.params.id);
  if (!inventory) {
    return res.status(404).json({ error: 'Registro de inventario no encontrado' });
  }
  res.status(204).send();
}));

module.exports = router;

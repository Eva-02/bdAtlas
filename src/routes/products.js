const express = require('express');
const Product = require('../models/Product');
const { requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.sku) filters.sku = req.query.sku;
  if (req.query.name) filters.name = new RegExp(req.query.name, 'i');
  const products = await Product.find(filters);
  res.json(products);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
}));

router.post('/', requireRole(['admin']), asyncHandler(async (req, res) => {
  const { sku, name, description, category, unitPrice } = req.body;
  if (!sku || !name || unitPrice == null) {
    return res.status(400).json({ error: 'sku, name y unitPrice son obligatorios' });
  }
  const existing = await Product.findOne({ sku });
  if (existing) {
    return res.status(400).json({ error: 'SKU ya existe' });
  }
  const product = await Product.create({ sku, name, description, category, unitPrice });
  res.status(201).json(product);
});

router.put('/:id', requireRole(['admin']), asyncHandler(async (req, res) => {
  const updates = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
}));

router.delete('/:id', requireRole(['admin']), asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.status(204).send();
}));

module.exports = router;

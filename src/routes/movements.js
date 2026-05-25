const express = require('express');
const Movement = require('../models/Movement');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const filters = {};
  if (req.query.productId) filters.productId = req.query.productId;
  if (req.query.warehouse) filters.warehouse = req.query.warehouse;
  if (req.query.type) filters.type = req.query.type;
  if (req.query.userId) filters.userId = req.query.userId;
  const movements = await Movement.find(filters).populate('productId userId');
  res.json(movements);
});

router.get('/:id', async (req, res) => {
  const movement = await Movement.findById(req.params.id).populate('productId userId');
  if (!movement) {
    return res.status(404).json({ error: 'Movimiento no encontrado' });
  }
  res.json(movement);
});

router.post('/', requireRole(['admin']), async (req, res) => {
  const { productId, userId, type, quantity, reason, warehouse } = req.body;
  if (!productId || !userId || !type || quantity == null || !warehouse) {
    return res.status(400).json({ error: 'productId, userId, type, quantity y warehouse son obligatorios' });
  }
  const movement = await Movement.create({ productId, userId, type, quantity, reason, warehouse });
  res.status(201).json(movement);
});

module.exports = router;

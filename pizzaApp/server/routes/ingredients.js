const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');

// list public
router.get('/', protect, async (req, res) => {
  const items = await Ingredient.find();
  res.json(items);
});

// admin create
router.post('/', protect, adminOnly, async (req, res) => {
  const it = await Ingredient.create(req.body);
  res.json(it);
});

// admin update
router.put('/:id', protect, adminOnly, async (req, res) => {
  const it = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(it);
});

// admin delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Ingredient.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;

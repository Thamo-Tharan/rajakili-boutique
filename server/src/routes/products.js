import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import requireAdmin from '../middleware/auth.js';

const router = Router();

const isValidId = (id) => mongoose.isValidObjectId(id);

// GET /api/products?category=Sarees&search=silk
router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Admin-only routes below
router.post('/', requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
});

export default router;

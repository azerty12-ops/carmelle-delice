const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { auth } = require('./users'); // Réutiliser le middleware d'auth admin si possible

// Middleware pour vérifier si c'est un admin
const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Accès restreint aux administrateurs' });
    }
  });
};

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all items (including unavailable - for admin)
router.get('/admin', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new item
router.post('/', adminAuth, async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update item
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE item
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article supprimé' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

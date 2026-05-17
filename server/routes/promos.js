const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const { adminAuth } = require('./users');

// Get all promos
router.get('/', adminAuth, async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Code manquant' });

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo) {
      return res.status(404).json({ valid: false, message: 'Code invalide' });
    }
    if (!promo.isActive) {
      return res.status(400).json({ valid: false, message: 'Code expiré ou inactif' });
    }

    res.json({ valid: true, discountPercentage: promo.discountPercentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create promo code
router.post('/', adminAuth, async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;
    if (!code || !discountPercentage) return res.status(400).json({ message: 'Données manquantes' });

    const existing = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Ce code existe déjà' });

    const promo = new PromoCode({
      code: code.toUpperCase(),
      discountPercentage
    });
    const newPromo = await promo.save();
    res.status(201).json(newPromo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle status or delete (using delete for simplicity here)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promo introuvable' });
    res.json({ message: 'Promo supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

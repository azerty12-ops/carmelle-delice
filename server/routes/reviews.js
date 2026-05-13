const express = require('express');
const Review = require('../models/Review');
const { auth } = require('./users');
const router = express.Router();

// Soumettre un avis (protégé)
router.post('/', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Auto-feature 5 star reviews for demo purposes
    const featured = rating === 5;
    
    const review = new Review({
      user: req.user.id,
      userName: req.body.userName || 'Client', // Passé par le frontend
      rating,
      comment,
      featured
    });
    
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les avis mis en avant (pour la page d'accueil)
router.get('/featured', async (req, res) => {
  try {
    const reviews = await Review.find({ featured: true }).sort({ createdAt: -1 }).limit(10);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

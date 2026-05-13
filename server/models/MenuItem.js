const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['pack', 'canape', 'plat'], required: true },
  pieces: { type: Number }, // Pour les packs
  image: { type: String },
  tag: { type: String }, // Ex: "Best-seller", "Idéal pour 1"
  items: [String], // Pour les packs (liste des composants)
  emoji: { type: String }, // Pour les canapés individuels
  isAvailable: { type: Boolean, default: true },
  color: { type: String }, // Gradient CSS pour les packs
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);

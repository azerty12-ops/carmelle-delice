const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./models/MenuItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carmeldelice';

const packs = [
  {
    name: 'Box Découverte', pieces: 18, price: 6500, tag: '✨ Populaire',
    category: 'pack', image: '/images/box_decouverte.png',
    items: ['5 pastels', '6 mini pizzas', '2 tacos', '2 quiches', '2 mini cakes', '1 nem', '1 Fanta ou Coca-Cola'],
    color: 'linear-gradient(135deg, #c0a44d, #e8d48b)',
  },
  {
    name: 'Box Moyenne', pieces: 20, price: 8500, tag: '🔥 Recommandé',
    category: 'pack', image: '/images/box_moyenne.png',
    items: ['5 pastels', '6 mini pizzas', '3 nems', '2 tacos', '2 quiches', '1 Coca-Cola ou Fanta'],
    color: 'linear-gradient(135deg, #4da0c0, #8bd4e8)',
  },
  {
    name: 'Box VIP', pieces: 25, price: 16000, tag: '⭐ Best-seller',
    category: 'pack', image: '/images/box_vip.png',
    items: ['6 pastels', '6 mini pizzas', '2 tacos', '3 brochettes', '2 nems', '2 bat\'bout', '4 quiches', '2 Coca-Cola ou Fanta'],
    color: 'linear-gradient(135deg, #c04d8c, #e88bd4)',
  },
  {
    name: 'Box Royale', pieces: 40, price: 25000, tag: '👑 Prestige',
    category: 'pack', image: '/images/box_royale.png',
    items: ['8 pastels', '8 mini pizzas', '4 tacos', '5 brochettes', '4 nems', '4 bat\'bout', '6 quiches', '1 Bouteille Fanta 1.5L'],
    color: 'linear-gradient(135deg, #c0964d, #e8c88b)',
  },
];

const plats = [
  { name: 'Kedjenou de Poulet', price: 4000, category: 'plat', image: '/images/kedjenou.png', items: ['Poulet braisé à l\'étouffée', 'Attiéké frais'] },
  { name: 'Placali Sauce Kopè', price: 3500, category: 'plat', image: '/images/placali.png', items: ['Pâte de manioc fermentée', 'Sauce Kopè (Gombo)', 'Viande et Poisson'] },
  { name: 'Tchep Rouge au Poisson', price: 4500, category: 'plat', image: '/images/tchep.png', items: ['Riz rouge traditionnel', 'Poisson assaisonné', 'Légumes de saison'] },
];

const canapes = [
  { name: 'Pastel viande', price: 600, emoji: '🥟', category: 'canape' },
  { name: 'Pastel poulet champignon', price: 750, emoji: '🥟', category: 'canape' },
  { name: 'Quiche', price: 450, emoji: '🥧', category: 'canape' },
  { name: 'Mini Pizza', price: 550, emoji: '🍕', category: 'canape' },
  { name: 'Nems', price: 400, emoji: '🌯', category: 'canape' },
  { name: 'Mini Burger', price: 750, emoji: '🍔', category: 'canape' },
  { name: 'Hot Dog', price: 600, emoji: '🌭', category: 'canape' },
  { name: 'Samosa', price: 500, emoji: '📐', category: 'canape' },
  { name: 'Begel', price: 550, emoji: '🥯', category: 'canape' },
  { name: 'Beignet crevette', price: 650, emoji: '🍤', category: 'canape' },
  { name: 'Ailerons', price: 800, emoji: '🍗', category: 'canape' },
  { name: 'Volovent poulet champignon', price: 650, emoji: '🧁', category: 'canape' },
  { name: 'Crêpes', price: 700, emoji: '🥞', category: 'canape' },
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connecté pour le seeding');
    await MenuItem.deleteMany({});
    await MenuItem.insertMany([...packs, ...plats, ...canapes]);
    console.log('✅ Menu initial inséré !');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Erreur seeding:', err);
    process.exit(1);
  });

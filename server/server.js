const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Trust proxy if hosted on platforms like Render or Heroku
app.set('trust proxy', 1);

// Sécurité : En-têtes HTTP
app.use(helmet());

// Sécurité : Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Autorise tout par défaut, mais permet d'utiliser une variable d'env
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Sécurité : Limiteur de requêtes global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limite chaque IP à 1000 requêtes
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use(limiter);

// Parse JSON payload et limite la taille
app.use(express.json({ limit: '10kb' }));

// Sécurité : Contre les injections NoSQL
app.use(mongoSanitize());

// Sécurité : Contre les failles XSS
app.use(xss());

// Root Route for Render Health Check
app.get('/', (req, res) => {
  res.json({ message: "Serveur Carmel Délice en ligne ! 🚀", status: "Ready" });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/carmeldelice';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('⚠️ MongoDB non connecté (mode hors ligne):', err.message));

// Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/promos', require('./routes/promos'));
app.use('/api/users', require('./routes/users').router);
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/menu', require('./routes/menu'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', restaurant: 'Carmel Délice' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur Carmel Délice sur http://localhost:${PORT}`));

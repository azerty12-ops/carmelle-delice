const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Accepte toutes les origines pour le moment (facilite le déploiement)
app.use(express.json());

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

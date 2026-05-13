const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'carmel_delice_super_secret';

// Middleware d'authentification
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Accès refusé' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token invalide' });
  }
};

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Cet email est déjà utilisé' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, points: user.points, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, points: user.points, phone: user.phone, addresses: user.addresses, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion Admin (Spécifique avec mot de passe hardcodé)
router.post('/admin-login', async (req, res) => {
  const password = req.body.password?.trim();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '77002602KO').trim();
  
  console.log('Login attempt:', { received: password, expected: ADMIN_PASSWORD });

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ id: 'admin', isAdmin: true }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { name: 'Admin', isAdmin: true } });
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' });
  }
});
// Connexion Sociale (Google)
router.post('/auth/social', async (req, res) => {
  try {
    const { token, provider } = req.body;
    let email, name;

    if (provider === 'google') {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
    } else {
      return res.status(400).json({ error: 'Fournisseur non supporté' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      user = new User({ name, email, password: hashedPassword });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, points: user.points, phone: user.phone, addresses: user.addresses, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur de vérification Google' });
  }
});

// Profil
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour le profil
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses) user.addresses = addresses;

    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, points: user.points, phone: user.phone, addresses: user.addresses } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, auth };

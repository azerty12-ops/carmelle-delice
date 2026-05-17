const router = require('express').Router();
const Reservation = require('../models/Reservation');
const { adminAuth } = require('./users');

router.post('/', async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json({ success: true, reservation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, reservation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

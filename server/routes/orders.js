const router = require('express').Router();
const Order = require('../models/Order');

// Create order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Stats (must be before /:id routes)
router.get('/stats', async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'pending' });
    const confirmed = await Order.countDocuments({ status: 'confirmed' });
    const preparing = await Order.countDocuments({ status: 'preparing' });
    const delivered = await Order.countDocuments({ status: 'delivered' });
    const cancelled = await Order.countDocuments({ status: 'cancelled' });

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'preparing', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Customer analytics
    const topCustomers = await Order.aggregate([
      { $group: {
        _id: { name: '$customerName', phone: '$customerPhone' },
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' },
        lastOrder: { $max: '$createdAt' },
        addresses: { $addToSet: '$customerAddress' }
      }},
      { $sort: { totalOrders: -1 } },
      { $limit: 10 }
    ]);

    // Popular items
    const popularItems = await Order.aggregate([
      { $unwind: '$items' },
      { $group: {
        _id: '$items.name',
        count: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Daily orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalPrice' }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        total, pending, confirmed, preparing, delivered, cancelled,
        revenue: revenueAgg[0]?.total || 0,
        topCustomers,
        popularItems,
        dailyOrders,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, error: 'Commande non trouvée' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

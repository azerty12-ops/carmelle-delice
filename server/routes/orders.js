const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { auth } = require('./users');

// Create order (Protected to ensure user linkage)
router.post('/', auth, async (req, res) => {
  try {
    const orderData = { 
      ...req.body,
      userId: req.user.id // Force the link to the logged-in user
    };
    
    // Si l'utilisateur utilise des points
    if (orderData.pointsUsed > 0) {
      const user = await User.findById(req.user.id);
      if (user && user.points >= orderData.pointsUsed) {
        user.points -= orderData.pointsUsed;
        await user.save();
      } else {
        orderData.pointsUsed = 0;
      }
    }

    const order = await Order.create(orderData);
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

// Get my orders (protected)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
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
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Commande non trouvée' });

    const prevStatus = order.status;
    order.status = status;
    await order.save();

    // Logique des points : 10 points fixes par commande livrée
    if (status === 'delivered' && prevStatus !== 'delivered' && order.userId) {
      const pointsEarned = 10;
      order.pointsEarned = pointsEarned;
      await order.save();
      
      const user = await User.findById(order.userId);
      if (user) {
        user.points += pointsEarned;
        
        // Bonus parrainage : si c'est la 1ère commande livrée, le parrain gagne 100 pts
        if (user.referredBy) {
          const ordersCount = await Order.countDocuments({ userId: order.userId, status: 'delivered' });
          if (ordersCount === 1) {
            const referrer = await User.findOne({ referralCode: user.referredBy });
            if (referrer) {
              referrer.points += 100;
              await referrer.save();
            }
          }
        }
        await user.save();
      }
    }

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

// Track order by orderNumber
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ success: false, error: 'Commande non trouvée' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

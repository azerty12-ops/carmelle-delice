const mongoose = require('mongoose');

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CD-${y}${m}${d}-${rand}`;
}

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, default: generateOrderNumber, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  notes: { type: String, default: '' },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    desc: String,
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'] },
  deliveryDate: { type: String, default: 'Aujourd\'hui' },
  deliveryTime: { type: String, default: 'Dès que possible' },
  paymentMethod: { type: String, default: 'cash', enum: ['cash', 'mobile_money'] },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid'] },
  promoCode: { type: String },
  discountAmount: { type: Number, default: 0 },
  locationUrl: { type: String },
  pointsEarned: { type: Number, default: 0 },
  pointsUsed: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

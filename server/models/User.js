const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  points: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: String }, // Referral code of the person who invited this user
  addresses: [{ type: String }],
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

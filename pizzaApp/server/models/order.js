const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
      category: String,
      name: String,
      price: Number
    }
  ],
  total: Number,
  razorpayOrderId: String,
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  status: { type: String, enum: ['received','in_kitchen','sent_for_delivery','delivered'], default: 'received' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

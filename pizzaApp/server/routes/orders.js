const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');
const razorpay = require('../utils/razorpay');
const Order = require('../models/order');
const Ingredient = require('../models/ingredient');

// create razorpay order (client sends items & total)
router.post('/create-order', protect, async (req, res) => {
  const { items, total } = req.body;
  const options = {
    amount: Math.round(total * 100), // in paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`
  };
  try {
    const rOrder = await razorpay.orders.create(options);
    // create order in db with pending payment
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      razorpayOrderId: rOrder.id,
      paymentStatus: 'pending'
    });
    res.json({ orderId: order._id, razorpayOrder: rOrder });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Razorpay error' });
  }
});

// verify webhook or client-side success and mark paid (for test/demo we'll accept client notify)
router.post('/confirm-payment', protect, async (req, res) => {
  const { orderId, razorpayPaymentId } = req.body;
  const order = await Order.findById(orderId);
  if(!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentStatus = 'paid';
  await order.save();

  // decrement stocks
  for(const it of order.items) {
    if(it.ingredient) {
      await Ingredient.findByIdAndUpdate(it.ingredient, { $inc: { stock: -1 }});
    } else {
      // fallback: decrement by name match
      await Ingredient.findOneAndUpdate({ name: it.name }, { $inc: { stock: -1 }});
    }
  }

  // notify admin via socket and maybe email
  const io = req.app.get('io');
  io.emit('new-order', { orderId: order._id });

  res.json({ message: 'Payment confirmed and order placed' });
});

// admin: list all orders
router.get('/', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user').sort({ createdAt: -1 });
  res.json(orders);
});

// admin update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  // notify the user via socket
  const io = req.app.get('io');
  io.emit('order-status-updated', { orderId: order._id, status });
  res.json(order);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

// register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if(!email || !password) return res.status(400).json({ message: 'Provide email and password' });
  const existing = await User.findOne({ email });
  if(existing) return res.status(400).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ name, email, password: hashed, verifyToken });
  // send verification email
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}&email=${encodeURIComponent(email)}`;
 // await sendEmail({ to: email, subject: 'Verify your email', html: `<p>Click <a href="${verifyUrl}">here</a> to verify.</p>` });
 user.isVerified = true;
await user.save();

  res.json({ message: 'Registered. Check email for verification.' });
});

// verify email
router.get('/verify', async (req, res) => {
  const { token, email } = req.query;
  const user = await User.findOne({ email, verifyToken: token });
  if(!user) return res.status(400).send('Invalid token');
  user.isVerified = true;
  user.verifyToken = null;
  await user.save();
  res.send('Email verified. You can now login.');
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ message: 'Invalid credentials' });
 // if(!user.isVerified) return res.status(400).json({ message: 'Verify your email first' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
});

// request reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ message: 'If account exists, check email' });
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendEmail({ to: email, subject: 'Reset password', html: `<p>Reset: <a href="${resetUrl}">link</a></p>` });
  res.json({ message: 'If account exists, check email' });
});

// reset
router.post('/reset-password', async (req, res) => {
  const { token, email, password } = req.body;
  const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }});
  if(!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
  res.json({ message: 'Password updated' });
});

module.exports = router;

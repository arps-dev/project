const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if(!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch(err) {
    console.error(err);
    res.status(401).json({ message: 'Not authorized' });
  }
};

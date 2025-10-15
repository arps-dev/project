require('dotenv').config();
const mongoose = require('../config/db');
const Ingredient = require('../models/ingredient');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

async function seed() {
  await Ingredient.deleteMany({});
  const items = [
    { name: 'Classic Crust', category: 'base', price: 50, stock: 100 },
    { name: 'Thin Crust', category: 'base', price: 60, stock: 100 },
    { name: 'Tomato Sauce', category: 'sauce', price: 10, stock: 200 },
    { name: 'BBQ Sauce', category: 'sauce', price: 15, stock: 200 },
    { name: 'Mozzarella', category: 'cheese', price: 20, stock: 150 },
    { name: 'Bell Pepper', category: 'veggie', price: 8, stock: 150 },
    { name: 'Pepperoni', category: 'meat', price: 30, stock: 120 }
  ];
  await Ingredient.insertMany(items);

  // create admin
  await User.deleteMany({});
  const admin = new User({
    name: 'Admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    isAdmin: true,
    isVerified: true
  });
  await admin.save();
  console.log('Seed done');
  process.exit(0);
}
seed();

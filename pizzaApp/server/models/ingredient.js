const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['base','sauce','cheese','veggie','meat'], required: true },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  threshold: { type: Number, default: 20 } // alert threshold
}, { timestamps: true });

module.exports = mongoose.model('Ingredient', ingredientSchema);

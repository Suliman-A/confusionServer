const mongoose = require('mongoose');

const { Schema } = mongoose;
// require('mongoose-currency').loadType(mongoose);

// const { Currency } = mongoose.Types;

const promoSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Promotions = mongoose.model('Promo', promoSchema);

module.exports = Promotions;

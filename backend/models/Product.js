const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['sarees', 'dupattas', 'fabrics', 'clothing', 'accessories', 'home-decor'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  finalPrice: Number,
  images: [String],
  thumbnail: String,
  inventory: {
    quantity: {
      type: Number,
      required: true
    },
    unit: String
  },
  details: {
    material: String,
    color: String,
    size: String,
    weight: String,
    careInstructions: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    customerId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate final price
productSchema.pre('save', function(next) {
  this.finalPrice = this.price - (this.price * this.discount / 100);
  next();
});

module.exports = mongoose.model('Product', productSchema);
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
    customerName: String,
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

const calculateFinalPrice = (price, discount) => {
  if (typeof price !== 'number' || typeof discount !== 'number') {
    return undefined;
  }
  const computed = price - (price * discount / 100);
  return Number.isFinite(computed) ? Number(computed.toFixed(2)) : undefined;
};

// Calculate final price
productSchema.pre('save', function(next) {
  this.finalPrice = calculateFinalPrice(this.price, this.discount);
  next();
});

// Recalculate final price on updates that bypass `save`
productSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (!update) {
    return next();
  }

  const set = update.$set || update;
  const priceChanged = Object.prototype.hasOwnProperty.call(set, 'price');
  const discountChanged = Object.prototype.hasOwnProperty.call(set, 'discount');

  if (!priceChanged && !discountChanged) {
    return next();
  }

  let price = priceChanged ? set.price : undefined;
  let discount = discountChanged ? set.discount : undefined;

  if (price === undefined || discount === undefined) {
    const currentDoc = await this.model.findOne(this.getQuery()).select('price discount');
    if (!currentDoc) {
      return next();
    }
    if (price === undefined) {
      price = currentDoc.price;
    }
    if (discount === undefined) {
      discount = currentDoc.discount;
    }
  }

  const finalPrice = calculateFinalPrice(price, discount);

  if (update.$set) {
    update.$set.finalPrice = finalPrice;
  } else {
    update.finalPrice = finalPrice;
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);
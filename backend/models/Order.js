const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    artisanId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  finalAmount: Number,
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'bank-transfer', 'cod'],
    default: 'razorpay'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  gatewayOrderId: String,
  paymentNotes: {
    type: Map,
    of: String
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  trackingNumber: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
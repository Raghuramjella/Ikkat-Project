const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authenticate, authorizeRole } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Artisan = require('../models/Artisan');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    // Calculate total and prepare items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      const subtotal = product.finalPrice * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        artisanId: product.artisanId,
        quantity: item.quantity,
        price: product.finalPrice,
        subtotal
      });
    }

    const tax = Math.round(totalAmount * 0.18); // 18% GST
    const finalAmount = totalAmount + tax;

    const order = new Order({
      customerId: req.user.id,
      items: orderItems,
      totalAmount,
      tax,
      finalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    if (paymentMethod === 'razorpay' || paymentMethod === 'upi') {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: finalAmount * 100,
          currency: 'INR',
          receipt: `IB-${order._id}`,
          notes: {
            orderId: order._id.toString(),
            customerId: req.user.id,
            paymentMethod
          }
        });

        order.gatewayOrderId = razorpayOrder.id;
        order.paymentNotes = razorpayOrder.notes;
        order.paymentStatus = 'pending';
        await order.save();

        return res.status(201).json({
          message: 'Order created',
          order,
          payment: {
            gateway: 'razorpay',
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
          }
        });
      } catch (gatewayError) {
        console.error('Razorpay order creation failed:', gatewayError);
        await Order.findByIdAndDelete(order._id);
        return res.status(500).json({ message: 'Payment initialization failed, please try again.' });
      }
    }

    if (paymentMethod === 'cod' || paymentMethod === 'bank-transfer') {
      order.paymentStatus = paymentMethod === 'cod' ? 'pending' : 'pending';
      await order.save();
    }

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:orderId', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customerId', 'name email phone')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner of order or admin
    if (order.customerId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer orders
router.get('/customer/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('items.productId', 'name images finalPrice category')
      .populate('items.artisanId', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artisan orders (orders containing their products)
router.get('/artisan/orders', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ userId: req.user.id });

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan profile not found' });
    }

    const orders = await Order.find({ 'items.artisanId': artisan._id })
      .populate('customerId', 'name email phone address')
      .populate('items.productId', 'name images finalPrice')
      .sort({ createdAt: -1 });

    const mappedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => item.artisanId.toString() === artisan._id.toString())
    }));

    res.json(mappedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (artisan can update, customer can cancel)
router.patch('/:orderId/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is customer (can only cancel) or artisan/admin
    if (req.user.role === 'customer') {
      if (order.customerId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ message: 'Customers can only cancel orders' });
      }
      if (order.orderStatus !== 'placed') {
        return res.status(400).json({ message: 'Only placed orders can be cancelled' });
      }
    } else if (req.user.role === 'artisan' || req.user.role === 'admin') {
      // Verify artisan has items in this order
      const artisan = await Artisan.findOne({ userId: req.user.id });
      if (!artisan && req.user.role !== 'admin') {
        return res.status(404).json({ message: 'Artisan profile not found' });
      }

      const hasItems = order.items.some(item => item.artisanId.toString() === (artisan?._id?.toString() || ''));
      if (!hasItems && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.orderStatus = status;
    order.updatedAt = new Date();
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (customer can cancel)
router.patch('/:orderId/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (order.orderStatus !== 'placed') {
      return res.status(400).json({ message: 'Only placed orders can be cancelled' });
    }

    order.orderStatus = 'cancelled';
    order.updatedAt = new Date();
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= UPI PAYMENT (RAZORPAY) =============
// Create payment order for UPI/Razorpay
router.post('/:orderId/payment/create', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!order.gatewayOrderId) {
      const razorpayOrder = await razorpay.orders.create({
        amount: order.finalAmount * 100,
        currency: 'INR',
        receipt: `IB-${order._id}`,
        notes: {
          orderId: order._id.toString(),
          customerId: req.user.id,
          paymentMethod: order.paymentMethod
        }
      });

      order.gatewayOrderId = razorpayOrder.id;
      order.paymentNotes = razorpayOrder.notes;
      order.paymentStatus = 'pending';
      await order.save();
    }

    res.json({
      message: 'Payment order ready',
      razorpayOrderId: order.gatewayOrderId,
      amount: order.finalAmount,
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment (client-side verification)
router.post('/:orderId/payment/verify', authenticate, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentMethod } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    order.paymentId = razorpayPaymentId;
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.updatedAt = new Date();
    await order.save();

    res.json({
      message: 'Payment verified successfully',
      order,
      paymentDetails: {
        orderId: order._id,
        amount: order.finalAmount,
        status: order.paymentStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Razorpay key (for frontend)
router.get('/payment/razorpay-key', (req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID
  });
});

module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { authenticate, authorizeRole } = require('../middleware/auth');
const Artisan = require('../models/Artisan');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');

const router = express.Router();

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@ikkatbazaar.com',
  password: process.env.ADMIN_PASSWORD || 'admin123456'
};

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ============= ADMIN LOGIN =============
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: 'admin-system', role: 'admin', email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Admin login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= PRODUCT MANAGEMENT =============
// Get all products (with optional filters)
router.get('/products', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { status, category, artisanId } = req.query;
    let filter = {};

    if (status) filter.isActive = status === 'active';
    if (category) filter.category = category;
    if (artisanId) filter.artisanId = artisanId;

    const products = await Product.find(filter)
      .populate('artisanId', 'businessName userId')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product details
router.get('/products/:productId', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('artisanId', 'businessName userId');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product details
router.put('/products/:productId', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description, price, discount, category, inventory, details } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        name,
        description,
        price,
        discount,
        category,
        inventory,
        details,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle product active status
router.patch('/products/:productId/toggle', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({ message: `Product ${product.isActive ? 'activated' : 'deactivated'}`, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:productId', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============= ARTISAN VERIFICATION =============
// Get all artisans
router.get('/artisans', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { verificationStatus: status } : {};

    const artisans = await Artisan.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify artisan
router.post('/artisans/:artisanId/verify', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { verificationNotes, status } = req.body;

    const updatePayload = {
      verificationStatus: status,
      verificationNotes,
      verifiedAt: new Date()
    };

    if (mongoose.Types.ObjectId.isValid(req.user.id)) {
      updatePayload.verifiedBy = req.user.id;
    }

    const artisan = await Artisan.findByIdAndUpdate(
      artisanId,
      updatePayload,
      { new: true }
    );

    // Update user verification status
    if (artisan?.userId) {
      await User.findByIdAndUpdate(artisan.userId, { isVerified: status === 'verified' });
    }

    res.json({ message: 'Artisan verification updated', artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending artisans
router.get('/artisans/pending', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const artisans = await Artisan.find({ verificationStatus: 'pending' })
      .populate('userId', 'name email phone');
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/orders/:orderId', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { orderStatus, updatedAt: new Date() },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get platform statistics
router.get('/statistics', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedArtisans = await Artisan.countDocuments({ verificationStatus: 'verified' });
    const pendingArtisans = await Artisan.countDocuments({ verificationStatus: 'pending' });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    res.json({
      totalUsers,
      verifiedArtisans,
      pendingArtisans,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
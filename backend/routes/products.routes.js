const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const Product = require('../models/Product');
const Artisan = require('../models/Artisan');
const Order = require('../models/Order');

const router = express.Router();

// Create product (artisan only)
router.post('/', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const { name, description, category, price, discount, images, inventory, details } = req.body;

    const artisan = await Artisan.findOne({ userId: req.user.id });
    if (!artisan) {
      return res.status(400).json({ message: 'Artisan profile not found' });
    }

    const product = new Product({
      artisanId: artisan._id,
      name,
      description,
      category,
      price,
      discount,
      images,
      thumbnail: images?.[0],
      inventory,
      details
    });

    await product.save();
    artisan.totalProducts += 1;
    await artisan.save();

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query)
      .populate('artisanId', 'businessName rating')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('artisanId');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (artisan only)
router.put('/:productId', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    const artisan = await Artisan.findOne({ userId: req.user.id });

    if (product.artisanId.toString() !== artisan._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.productId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Product updated', product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (artisan only)
router.delete('/:productId', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    const artisan = await Artisan.findOne({ userId: req.user.id });

    if (product.artisanId.toString() !== artisan._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.productId);
    artisan.totalProducts -= 1;
    await artisan.save();

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:productId/review', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if customer is the artisan of this product
    if (product.artisanId.toString() === req.user.id || 
        (await Artisan.findOne({ userId: req.user.id, _id: product.artisanId }))) {
      return res.status(403).json({ message: 'Artisans cannot review their own products' });
    }

    // Check if user is a customer or if they've purchased this product
    const hasOrdered = await Order.findOne({
      customerId: req.user.id,
      'items.productId': req.params.productId,
      orderStatus: { $in: ['confirmed', 'shipped', 'delivered'] }
    });

    if (!hasOrdered) {
      return res.status(403).json({ message: 'You can only review products you have purchased and received' });
    }

    // Check if already reviewed
    const alreadyReviewed = product.reviews.some(r => r.customerId.toString() === req.user.id);
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $push: {
          reviews: {
            customerId: req.user.id,
            rating: parseInt(rating),
            comment,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).populate('reviews.customerId', 'name profileImage');

    // Calculate average rating
    const avgRating = updated.reviews.reduce((sum, r) => sum + r.rating, 0) / updated.reviews.length;
    updated.rating = Math.round(avgRating * 10) / 10;
    await updated.save();

    res.json({ message: 'Review added successfully', product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product reviews
router.get('/:productId/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('reviews.customerId', 'name profileImage');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      reviews: product.reviews,
      averageRating: product.rating,
      totalReviews: product.reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const Artisan = require('../models/Artisan');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Create artisan profile
router.post('/profile', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const { businessName, yearsOfExperience, specialties, bio, bankDetails, documents } = req.body;

    let artisan = await Artisan.findOne({ userId: req.user.id });

    if (artisan) {
      artisan = await Artisan.findByIdAndUpdate(
        artisan._id,
        {
          businessName,
          yearsOfExperience,
          specialties,
          bio,
          bankDetails,
          documents
        },
        { new: true }
      );
    } else {
      artisan = new Artisan({
        userId: req.user.id,
        businessName,
        yearsOfExperience,
        specialties,
        bio,
        bankDetails,
        documents
      });
      await artisan.save();
    }

    res.status(201).json({ message: 'Artisan profile created/updated', artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update artisan profile (PUT)
router.put('/profile', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const { businessName, yearsOfExperience, specialties, bio, bankDetails, documents } = req.body;

    let artisan = await Artisan.findOne({ userId: req.user.id });

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan profile not found' });
    }

    artisan = await Artisan.findByIdAndUpdate(
      artisan._id,
      {
        businessName,
        yearsOfExperience,
        specialties,
        bio,
        bankDetails,
        documents
      },
      { new: true }
    );

    res.json({ message: 'Artisan profile updated successfully', artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artisan profile
router.get('/profile', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ userId: req.user.id });
    if (!artisan) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artisan products
router.get('/products', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ userId: req.user.id });

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan profile not found' });
    }

    if (artisan.verificationStatus !== 'verified') {
      return res.status(403).json({ message: 'Your artisan profile must be verified before accessing products.' });
    }

    const products = await Product.find({ artisanId: artisan._id }).sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artisan by ID (public)
router.get('/:artisanId', async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.artisanId)
      .populate('userId', 'name email phone');
    if (!artisan) {
      return res.status(404).json({ message: 'Artisan not found' });
    }
    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artisan sales
router.get('/sales/summary', authenticate, authorizeRole('artisan'), async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ userId: req.user.id });
    res.json({
      totalProducts: artisan.totalProducts,
      totalSales: artisan.totalSales,
      rating: artisan.rating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
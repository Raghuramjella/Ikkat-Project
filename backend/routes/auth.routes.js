const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const transporter = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null;

const sendPasswordResetOtpEmail = async (email, otp) => {
  if (!transporter) {
    throw new Error('Email service is not configured');
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Ikkat Bazaar password reset OTP',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      address
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password - Generate OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If this email is registered, an OTP has been sent' });
    }

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.passwordResetOtp = hashedOtp;
    user.passwordResetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetOtpAttempts = 0;

    try {
      await sendPasswordResetOtpEmail(email, otp);
      await user.save();
    } catch (emailError) {
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpiry = undefined;
      user.passwordResetOtpAttempts = 0;
      await user.save();
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({
      message: 'If this email is registered, an OTP has been sent'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or email' });
    }

    if (!user.passwordResetOtp || !user.passwordResetOtpExpiry) {
      return res.status(400).json({ message: 'Request a new OTP' });
    }

    const now = new Date();

    if (user.passwordResetOtpExpiry < now) {
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpiry = undefined;
      user.passwordResetOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedOtp !== user.passwordResetOtp) {
      user.passwordResetOtpAttempts = (user.passwordResetOtpAttempts || 0) + 1;

      if (user.passwordResetOtpAttempts >= 5) {
        user.passwordResetOtp = undefined;
        user.passwordResetOtpExpiry = undefined;
        user.passwordResetOtpAttempts = 0;
        await user.save();
        return res.status(429).json({ message: 'Too many invalid attempts. Request a new OTP.' });
      }

      await user.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.password = newPassword;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpiry = undefined;
    user.passwordResetOtpAttempts = 0;
    await user.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload Profile Image
router.post('/upload-profile-image', authenticate, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ikkat-bazaar/profiles',
          resource_type: 'auto',
          quality: 'auto:good'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user profile image
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile image uploaded successfully',
      user,
      profileImage: result.secure_url
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: String,
  role: {
    type: String,
    enum: ['admin', 'artisan', 'customer'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  profileImage: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  otp: String,
  otpExpiry: Date,
  otpVerified: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
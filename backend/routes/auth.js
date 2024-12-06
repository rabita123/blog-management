const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return res.status(400).json({
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    console.log('Creating new user...');
    const user = new User({
      username,
      email,
      password // Will be hashed by the pre-save middleware
    });

    // Save user to database
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);

    // Generate JWT
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email or username already exists'
      });
    }

    res.status(500).json({ 
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add this route to test MongoDB connection
router.get('/test-db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections);
    
    const dbStats = await mongoose.connection.db.stats();
    console.log('Database stats:', dbStats);
    
    res.json({ 
      message: 'Database connection working',
      collections: collections.map(c => c.name),
      stats: dbStats
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add this route to check current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    const savedUser = await testUser.save();
    console.log('Test user created:', savedUser);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createTestUser(); 
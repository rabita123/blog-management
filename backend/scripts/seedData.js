const mongoose = require('mongoose');
const Post = require('../models/Post');
require('dotenv').config();

const seedPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test posts
    const posts = await Post.create([
      {
        title: 'First Test Post',
        content: 'This is our first test post content.',
        author: '65f1a2b3c4d5e6f7g8h9i0j1', // Replace with a valid user ID
        tags: ['test', 'first']
      },
      {
        title: 'Second Test Post',
        content: 'This is our second test post content.',
        author: '65f1a2b3c4d5e6f7g8h9i0j1', // Replace with a valid user ID
        tags: ['test', 'second']
      }
    ]);

    console.log('Created test posts:', posts);
  } catch (error) {
    console.error('Error seeding posts:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedPosts(); 
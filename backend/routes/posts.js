const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all posts with pagination and search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 5, search, tag } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    console.log('Fetching posts with query:', query);

    const posts = await Post.find(query)
      .populate({
        path: 'author',
        select: 'username email'
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    console.log('Found posts:', posts);

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new post (protected route)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating post with user ID:', req.userId);
    
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      author: req.userId
    });

    const savedPost = await post.save();
    
    // Populate author details after saving
    await savedPost.populate({
      path: 'author',
      select: 'username email'
    });

    console.log('Created post:', savedPost);
    
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update post (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags
      },
      { new: true }
    ).populate('author', 'username');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete post (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
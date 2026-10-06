const Post = require('../models/post.models');

// Create a new post / arena
exports.createPost = async (req, res) => {
  try {
    const { title, category, tagline, description, venue, prizePool, poster } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newPost = await Post.create({
      title,
      category: category || 'Coding & Tech',
      tagline: tagline || '',
      description,
      venue: venue || 'Seminar Hall 1',
      prizePool: prizePool || '₹5,000 Total',
      poster: poster || '/assets/poster-brainiac.jpg',
      createdBy: req.user ? req.user.id : null
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts / arenas
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

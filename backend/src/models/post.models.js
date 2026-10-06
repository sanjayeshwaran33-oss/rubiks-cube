const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Arena title is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Coding & Tech', 'Research & Demo', 'Quiz & Logic', 'Ads & Treasure Hunt'],
      default: 'Coding & Tech'
    },
    tagline: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      default: '/assets/poster-brainiac.jpg'
    },
    matchScore: {
      type: Number,
      default: 98
    },
    ageRating: {
      type: String,
      default: 'U/A 16+'
    },
    duration: {
      type: String,
      default: '75m'
    },
    timing: {
      type: String,
      default: '24 Oct 2026 • 10:00 AM'
    },
    venue: {
      type: String,
      default: 'Seminar Hall 1'
    },
    prizePool: {
      type: String,
      default: '₹10,000 Total'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    pullRequest: {
    url: String,
    number: Number,
    branch: String,
    createdAt: Date,
  },
  userId: {
    type: String,
    required: false // optional for non-logged in users
  },
  originalCode: {
    type: String,
    required: true
  },
  improvedCode: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Best Practices', 'Better Performance', 'Bug Fix'],
    required: true
  },
  language: {
    type: String,
    required: true
  },
  metrics: {
    linesOfCode: Number,
    complexityScore: Number,
    qualityRating: String,
    issuesFound: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
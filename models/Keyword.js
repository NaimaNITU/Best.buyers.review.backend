const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  caseSensitive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster searching
keywordSchema.index({ word: 1, isActive: 1 });

module.exports = mongoose.model('Keyword', keywordSchema);
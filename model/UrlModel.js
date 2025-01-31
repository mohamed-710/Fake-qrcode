const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  fakeUrl: {
    type: String,
    required: true,
    unique: true
  },
  fakePath: {
    type: String,
    required: true,
    unique: true
  },
  qrCodePath: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Url', UrlSchema);
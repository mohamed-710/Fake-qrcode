const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  fakeUrl: {
    type: String,
    required: true,
 
  },
  fakePath: {
    type: String,
    required: true,
   
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
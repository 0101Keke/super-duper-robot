const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  type: { type: String, enum: ['PDF','Video','Audio','Link','Other'], required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);

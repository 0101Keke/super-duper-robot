const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  resources: [
    {
      name: String,
      type: String, // PDF, Video, Link, etc.
      url: String
    }
  ],
  assignments: [
    {
      title: String,
      description: String,
      deadline: Date,
      fileUrl: String,
      submissions: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          fileUrl: String,
          submittedAt: { type: Date, default: Date.now }
        }
      ]
    }
  ],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);

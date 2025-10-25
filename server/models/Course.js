const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thumbnail: { type: String },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress: {
    type: Map,
    of: Number, // progress percentage per studentId
    default: {}
  },
  resources: [
    {
      title: String,
      type: { type: String, enum: ['PDF', 'Video', 'Link'], default: 'PDF' },
      url: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

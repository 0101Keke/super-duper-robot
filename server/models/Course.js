const mongoose = require('mongoose');

<<<<<<< HEAD
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['Math', 'Science', 'English', 'History', 'Computer Science', 'Languages', 'Arts', 'Other']
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    maxStudents: {
        type: Number,
        default: 10
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    schedule: {
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        time: String, // e.g., "10:00 AM"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'draft'],
        default: 'active'
    },
    thumbnail: {
        type: String, // URL or path to image
        default: null
    },
    syllabus: [{
        week: Number,
        topic: String,
        description: String
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
CourseSchema.index({ tutor: 1, status: 1 });
CourseSchema.index({ subject: 1, level: 1 });

// Virtual for enrolled count
CourseSchema.virtual('enrolledCount').get(function () {
    return this.enrolledStudents.length;
});

// Virtual for available seats
CourseSchema.virtual('availableSeats').get(function () {
    return this.maxStudents - this.enrolledStudents.length;
});

module.exports = mongoose.model('Course', CourseSchema);
=======
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
>>>>>>> 9438b22f94d925f2ae4224824fd91ef9f7689a10

// server/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    // Basic Information
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },

    // Categorization
    subject: {
        type: String,
        required: true,
        enum: ['Math', 'Science', 'English', 'History', 'Computer Science', 'Languages', 'Arts', 'Other']
    },
    category: {
        type: String
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },

    // Tutor Information
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Course Details
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    duration: {
        type: Number, // in hours
        required: true
    },

    // Enrollment
    maxStudents: {
        type: Number,
        default: 10
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Progress Tracking
    progress: {
        type: Map,
        of: Number, // progress percentage per studentId
        default: {}
    },

    // Schedule
    schedule: {
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        time: String // e.g., "10:00 AM"
    },

    // Dates
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'draft'],
        default: 'active'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Media
    thumbnail: {
        type: String, // URL or path to image
        default: null
    },

    // Resources
    resources: [{
        title: String,
        type: {
            type: String,
            enum: ['PDF', 'Video', 'Link'],
            default: 'PDF'
        },
        url: String
    }],

    // Syllabus
    syllabus: [{
        week: Number,
        topic: String,
        description: String
    }]
}, {
    timestamps: true,
    collection: 'courses'
});

// Indexes for faster queries
courseSchema.index({ tutor: 1, status: 1 });
courseSchema.index({ subject: 1, level: 1 });

// Virtual for enrolled count
courseSchema.virtual('enrolledCount').get(function () {
    return this.enrolledStudents.length;
});

// Virtual for available seats
courseSchema.virtual('availableSeats').get(function () {
    return this.maxStudents - this.enrolledStudents.length;
});

// Prevent model overwrite error
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
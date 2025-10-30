<<<<<<< HEAD
// server/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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
    code: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        uppercase: true 
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

module.exports = mongoose.model('Course', courseSchema);
=======
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * ?? Main authentication middleware
 */
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    let token = null;

    // Accept either Bearer token or x-auth-token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.header('x-auth-token')) {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

/**
 * ????? Admin check middleware
 */
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * ?? Tutor check middleware
 */
const isTutor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'tutor' || !user.isApproved) {
            return res.status(403).json({ message: 'Access denied. Approved tutors only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ? Proper exports
module.exports = auth;
module.exports.isAdmin = isAdmin;
module.exports.isTutor = isTutor;
>>>>>>> home-shiva

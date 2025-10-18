const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'tutor', 'admin'],
        default: 'student'
    },
    cv: {
        type: String, // URL to stored CV file
        required: function () {
            return this.role === 'tutor';
        }
    },
    isApproved: {
        type: Boolean,
        default: function () {
            return this.role !== 'tutor'; // Tutors need approval
        }
    },
    profilePicture: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 500
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);
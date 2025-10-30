
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },

    answer: {
        type: String,
        required: true,
        trim: true
    },

    moduleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
        index: true
    },

    // Additional helpful fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    isActive: {
        type: Boolean,
        default: true
    },

    views: {
        type: Number,
        default: 0
    },

    helpfulCount: {
        type: Number,
        default: 0
    },

    notHelpfulCount: {
        type: Number,
        default: 0
    },

    tags: [{
        type: String,
        trim: true
    }],

    order: {
        type: Number,
        default: 0  // For custom ordering
    }
}, {
    timestamps: true
});

// Indexes
faqSchema.index({ moduleID: 1, isActive: 1 });
faqSchema.index({ question: 'text', answer: 'text' });  // Text search
faqSchema.index({ order: 1 });

// Method to update answer
faqSchema.methods.updateAnswer = async function (newAnswer, updatedBy = null) {
    if (!newAnswer || newAnswer.trim() === '') {
        throw new Error('Answer cannot be empty');
    }

    this.answer = newAnswer.trim();
};
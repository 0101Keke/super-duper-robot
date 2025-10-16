// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    topicID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
        index: true
    },

    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null  // Nullable for anonymous posts
    },

    parentPostID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null  // For threaded replies
    },

    content: {
        type: String,
        required: true
    },

    datePosted: {
        type: Date,
        default: Date.now,
        required: true
    },

    // Additional fields for moderation (from earlier)
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    moderated: {
        type: Boolean,
        default: false
    },

    moderatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    moderatedAt: {
        type: Date,
        default: null
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    approvedAt: {
        type: Date,
        default: null
    },

    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    rejectedAt: {
        type: Date,
        default: null
    },

    rejectionReason: {
        type: String,
        default: null
    },

    // Track edits
    editedAt: {
        type: Date,
        default: null
    },

    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt
});

// Index for faster queries
postSchema.index({ topicID: 1, datePosted: -1 });
postSchema.index({ parentPostID: 1 });
postSchema.index({ studentID: 1 });

// Method to create a reply to this post
postSchema.methods.reply = async function (content, studentID = null) {
    if (!content || content.trim() === '') {
        throw new Error('Reply content cannot be empty');
    }

    const Post = mongoose.model('Post');
    
    const replyPost = new Post({
        topicID: this.topicID,
        studentID: studentID,
        parentPostID: this._id,  // This post becomes the parent
        content: content,
        datePosted: new Date()
    });

    await replyPost.save();
    return replyPost;
};

// Method to edit the post content
postSchema.methods.edit = async function (content) {
    if (!content || content.trim() === '') {
        throw new Error('Content cannot be empty');
    }

    this.content = content;
    this.editedAt = new Date();
    this.isEdited = true;

    await this.save();
    return this;
};

// Static method to get all replies for a post
postSchema.statics.getReplies = async function (postId) {
    return await this.find({ parentPostID: postId })
        .populate('studentID', 'username email')
        .sort({ datePosted: 1 });
};

// Static method to get top-level posts (no parent) for a topic
postSchema.statics.getTopLevelPosts = async function (topicId) {
    return await this.find({ 
        topicID: topicId, 
        parentPostID: null 
    })
    .populate('studentID', 'username email')
    .sort({ datePosted: -1 });
};

// Static method to get all posts in a topic (including replies)
postSchema.statics.getPostsByTopic = async function (topicId) {
    return await this.find({ topicID: topicId })
        .populate('studentID', 'username email')
        .populate('parentPostID')
        .sort({ datePosted: 1 });
};

// Virtual property to check if post is anonymous
postSchema.virtual('isAnonymous').get(function () {
    return this.studentID === null;
});

// Virtual property to get reply count
postSchema.virtual('replyCount', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'parentPostID',
    count: true
});

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

postSchema.virtual('upvoteCount', {
    ref: 'Upvote',
    localField: '_id',
    foreignField: 'postID',
    count: true
});

// Method to get upvote count
postSchema.methods.getUpvoteCount = async function () {
    const Upvote = mongoose.model('Upvote');
    return await Upvote.getUpvoteCount(this._id);
};

// Method to check if a student has upvoted this post
postSchema.methods.isUpvotedBy = async function (studentId) {
    const Upvote = mongoose.model('Upvote');
    return await Upvote.hasUpvoted(this._id, studentId);
};

// Method to toggle upvote
postSchema.methods.toggleUpvote = async function (studentId) {
    const Upvote = mongoose.model('Upvote');
    return await Upvote.toggleUpvote(this._id, studentId);
};

// Middleware to remove upvotes when post is deleted
postSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const Upvote = mongoose.model('Upvote');
    await Upvote.removeAllForPost(this._id);
    next();
});

// Ensure virtuals are included
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
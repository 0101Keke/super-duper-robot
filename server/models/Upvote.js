
const mongoose = require('mongoose');

const upvoteSchema = new mongoose.Schema({
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },

    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    dateUpvoted: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

// Compound index to ensure one upvote per student per post
upvoteSchema.index({ postID: 1, studentID: 1 }, { unique: true });

// Additional indexes for queries
upvoteSchema.index({ postID: 1, dateUpvoted: -1 });
upvoteSchema.index({ studentID: 1, dateUpvoted: -1 });

// Method to remove the upvote
upvoteSchema.methods.remove = async function () {
    try {
        await this.deleteOne();
        return {
            success: true,
            message: 'Upvote removed successfully'
        };
    } catch (error) {
        throw new Error(`Failed to remove upvote: ${error.message}`);
    }
};

// Static method to toggle upvote (add if doesn't exist, remove if exists)
upvoteSchema.statics.toggleUpvote = async function (postId, studentId) {
    try {
        // Check if upvote already exists
        const existingUpvote = await this.findOne({
            postID: postId,
            studentID: studentId
        });

        if (existingUpvote) {
            // Remove upvote
            await existingUpvote.remove();
            return {
                success: true,
                action: 'removed',
                message: 'Upvote removed',
                upvoted: false
            };
        } else {
            // Add upvote
            const newUpvote = new this({
                postID: postId,
                studentID: studentId
            });
            await newUpvote.save();
            return {
                success: true,
                action: 'added',
                message: 'Upvote added',
                upvoted: true,
                upvote: newUpvote
            };
        }
    } catch (error) {
        throw new Error(`Failed to toggle upvote: ${error.message}`);
    }
};

// Static method to get upvote count for a post
upvoteSchema.statics.getUpvoteCount = async function (postId) {
    return await this.countDocuments({ postID: postId });
};

// Static method to check if a student has upvoted a post
upvoteSchema.statics.hasUpvoted = async function (postId, studentId) {
    const upvote = await this.findOne({
        postID: postId,
        studentID: studentId
    });
    return !!upvote;
};

// Static method to get all upvotes for a post
upvoteSchema.statics.getUpvotesByPost = async function (postId, options = {}) {
    const { limit = 50, skip = 0, populate = true } = options;
    
    let query = this.find({ postID: postId })
        .sort({ dateUpvoted: -1 })
        .limit(limit)
        .skip(skip);
    
    if (populate) {
        query = query.populate('studentID', 'username email');
    }
    
    return await query;
};

// Static method to get all posts upvoted by a student
upvoteSchema.statics.getUpvotesByStudent = async function (studentId, options = {}) {
    const { limit = 50, skip = 0, populate = true } = options;
    
    let query = this.find({ studentID: studentId })
        .sort({ dateUpvoted: -1 })
        .limit(limit)
        .skip(skip);
    
    if (populate) {
        query = query.populate('postID');
    }
    
    return await query;
};

// Static method to remove all upvotes for a post (when post is deleted)
upvoteSchema.statics.removeAllForPost = async function (postId) {
    const result = await this.deleteMany({ postID: postId });
    return {
        success: true,
        deletedCount: result.deletedCount,
        message: `Removed ${result.deletedCount} upvote(s)`
    };
};

// Static method to remove all upvotes by a student (when student is deleted)
upvoteSchema.statics.removeAllByStudent = async function (studentId) {
    const result = await this.deleteMany({ studentID: studentId });
    return {
        success: true,
        deletedCount: result.deletedCount,
        message: `Removed ${result.deletedCount} upvote(s)`
    };
};

// Static method to get top upvoted posts
upvoteSchema.statics.getTopUpvotedPosts = async function (limit = 10, topicId = null) {
    const pipeline = [
        // Group by post and count upvotes
        {
            $group: {
                _id: '$postID',
                upvoteCount: { $sum: 1 },
                lastUpvoted: { $max: '$dateUpvoted' }
            }
        },
        // Sort by upvote count
        { $sort: { upvoteCount: -1 } },
        // Limit results
        { $limit: limit },
        // Lookup post details
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: '_id',
                as: 'post'
            }
        },
        // Unwind post array
        { $unwind: '$post' }
    ];

    // Filter by topic if provided
    if (topicId) {
        pipeline.unshift({
            $lookup: {
                from: 'posts',
                localField: 'postID',
                foreignField: '_id',
                as: 'postData'
            }
        });
        pipeline.unshift({ $unwind: '$postData' });
        pipeline.unshift({ $match: { 'postData.topicID': mongoose.Types.ObjectId(topicId) } });
    }

    return await this.aggregate(pipeline);
};

module.exports = mongoose.model('Upvote', upvoteSchema);
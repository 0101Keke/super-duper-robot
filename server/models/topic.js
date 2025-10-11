// models/Topic.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },

    description: {
        type: String,
        maxlength: 1000
    },

    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: {
        type: String,
        enum: ['open', 'closed', 'archived'],
        default: 'open'
    },

    isPinned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

//Method skeletons
topicSchema.methods.addResponse = async function (tutorOrId, text) {
    return null;
};

topicSchema.methods.addResource = async function (file) {
    return null;
};

topicSchema.methods.closeTopic = async function () {
};

topicSchema.index({ courseID: 1, createdAt: -1 });


// Export the enum for use in other files
topicSchema.statics.TopicStatus = TopicStatus;

module.exports = mongoose.model('Topic', topicSchema);
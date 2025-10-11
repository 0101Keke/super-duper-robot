const mongoose = require('mongoose');

// Enum for TopicStatus
const TopicStatus = {
    OPEN: 'OPEN',
    RESOLVED: 'RESOLVED'
};

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TopicStatus),
        default: TopicStatus.OPEN,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
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

// Export the enum for use in other files
topicSchema.statics.TopicStatus = TopicStatus;

module.exports = mongoose.model('Topic', topicSchema);
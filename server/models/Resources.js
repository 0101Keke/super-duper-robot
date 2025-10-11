const mongoose = require('mongoose');

// Enum for ResourceType
const ResourceType = {
    PDF: 'PDF',
    VIDEO: 'Video',
    AUDIO: 'Audio',
    OTHER: 'Other'
};

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: Object.values(ResourceType),
        required: true
    },

    filePath: {
        type: String,
        required: true
    },

    uploadedDate: {
        type: Date,
        default: Date.now,
        required: true
    },

    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },

    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    }
},

    {
    timestamps: true
});

//Method skeletons
resourceSchema.methods.download = function () {
    return null;
};

resourceSchema.methods.delete = async function () {

};

// Exporting the enum
resourceSchema.statics.ResourceType = ResourceType;

module.exports = mongoose.model('Resource', resourceSchema);
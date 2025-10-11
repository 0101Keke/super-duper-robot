const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ''
    },
    staffId: {
        type: String,
        maxlength: 20
    }
}, {
    timestamps: true
});

//Method Skeletons
tutorSchema.methods.respondTopic = async function (topicOrId, response) {
    return null;
};

tutorSchema.methods.uploadMaterial = async function (topicOrId, filePath, type) {
    return null;
};

tutorSchema.methods.markResolved = async function (topicOrId) {
};

module.exports = mongoose.model('Tutor', tutorSchema);
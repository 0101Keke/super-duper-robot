const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    programme: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: Number,
        min: 1,
        max: 4,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

//Method Skeletons
studentSchema.methods.createTopic = async function (title, description, moduleId) {
    return null;
};

studentSchema.methods.subscribeTopic = async function (topicOrId) {
};

studentSchema.methods.sendMessage = async function (tutorOrId, content) {
    return null;
};

studentSchema.methods.giveFeedback = async function (tutorOrId, rating, comment) {
    return null;
};

module.exports = mongoose.model('Student', studentSchema);
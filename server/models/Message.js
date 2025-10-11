const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
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
    },

    content: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    }
},

    {
    timestamps: true
});

//Method skeletons
messageSchema.methods.markRead = function () {

};

module.exports = mongoose.model('Message', messageSchema);
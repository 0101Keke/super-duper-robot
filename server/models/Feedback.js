const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
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

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    comment: {
        type: String
    },

    feedbackDate: {
        type: Date,
        default: Date.now
    }
},

    {
    timestamps: true
});

//Method skeletons
feedbackSchema.methods.updateFeedback = function (newRating, newComment) {
  
};

module.exports = mongoose.model('Feedback', feedbackSchema);
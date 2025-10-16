const mongoose = require('mongoose');

const tutorResponseSchema = new mongoose.Schema({
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

    responseText: {
        type: String,
        required: true
    },

    responseDate: {
        type: Date,
        default: Date.now,
        required: true
    }
},

    {
    timestamps: true
});

//Method skeletons
tutorResponseSchema.methods.editResponse = function (newText) {
};

module.exports = mongoose.model('TutorResponse', tutorResponseSchema);
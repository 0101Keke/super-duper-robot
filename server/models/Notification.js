const mongoose = require('mongoose');

// Enum for NotificationType
const NotificationType = {
    EMAIL: 'EMAIL',
    SMS: 'SMS'
};

const notificationSchema = new mongoose.Schema({
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

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true
    },

    dateSent: {
        type: Date,
        default: Date.now
    }
},

    {
    timestamps: true
});

//Method skeletons
notificationSchema.methods.send = function () {
};

//Exporting the enum
notificationSchema.statics.NotificationType = NotificationType;

module.exports = mongoose.model('Notification', notificationSchema);
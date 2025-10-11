const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },

    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },

    subscribedDate: {
        type: Date,
        default: Date.now
    }
},

    {
    timestamps: true
});

//Compound index - Ensuring a student can only subscribe once to a topic
subscriptionSchema.index({ studentId: 1, topicId: 1 }, { unique: true });

//Method skeletons
subscriptionSchema.methods.unsubscribe = async function () {

};

module.exports = mongoose.model('Subscription', subscriptionSchema);
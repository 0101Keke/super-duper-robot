const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    moduleCode: {
        type: String,
        required: true,
        maxlength: 10
    },

    moduleName: {
        type: String,
        required: true,
        maxlength: 100
    }
},

    {
    timestamps: true
});

//Method skeletons
moduleSchema.methods.addTopic = async function (title) {
    return null;
};

moduleSchema.methods.assignTutor = async function (tutorOrId) {
    return null;
};

module.exports = mongoose.model('Module', moduleSchema);
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

tutorSchema.methods.addExpertise = async function (moduleId, level = 'Beginner') {
    const Expertise = mongoose.model('Expertise');
    
    const result = await Expertise.findOrCreate(this._id, moduleId, level);
    
    return result;
};

// Method to update expertise level
tutorSchema.methods.updateExpertise = async function (moduleId, level) {
    const Expertise = mongoose.model('Expertise');
    
    const expertise = await Expertise.findOne({
        tutorID: this._id,
        moduleID: moduleId
    });
    
    if (!expertise) {
        throw new Error('Expertise not found');
    }
    
    return await expertise.updateExpertiseLevel(level);
};

// Method to get all expertise
tutorSchema.methods.getExpertise = async function () {
    const Expertise = mongoose.model('Expertise');
    return await Expertise.getExpertiseByTutor(this._id);
};

// Method to remove expertise
tutorSchema.methods.removeExpertise = async function (moduleId) {
    const Expertise = mongoose.model('Expertise');
    
    const result = await Expertise.deleteOne({
        tutorID: this._id,
        moduleID: moduleId
    });
    
    return {
        success: result.deletedCount > 0,
        message: result.deletedCount > 0 ? 'Expertise removed' : 'Expertise not found'
    };
};

module.exports = mongoose.model('Tutor', tutorSchema);
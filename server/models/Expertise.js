
const mongoose = require('mongoose');

// Enum for expertise levels
const ExpertiseLevel = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert'
};

const expertiseSchema = new mongoose.Schema({
    tutorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming Tutor is a User with userType: 'Tutor'
        required: true,
        index: true
    },

    moduleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
        index: true
    },

    expertiseLevel: {
        type: String,
        enum: Object.values(ExpertiseLevel),
        required: true,
        default: ExpertiseLevel.BEGINNER
    },

    // Additional helpful fields
    yearsOfExperience: {
        type: Number,
        min: 0,
        default: 0
    },

    certifications: [{
        name: String,
        issuer: String,
        dateObtained: Date
    }],

    verified: {
        type: Boolean,
        default: false
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    verifiedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Compound unique index - one expertise record per tutor per module
expertiseSchema.index({ tutorID: 1, moduleID: 1 }, { unique: true });

// Index for querying by expertise level
expertiseSchema.index({ expertiseLevel: 1 });

// Method to update expertise level
expertiseSchema.methods.updateExpertiseLevel = async function (level) {
    // Validate level
    if (!Object.values(ExpertiseLevel).includes(level)) {
        throw new Error(`Invalid expertise level. Must be one of: ${Object.values(ExpertiseLevel).join(', ')}`);
    }

    // Update level
    this.expertiseLevel = level;
    
    await this.save();
    
    return {
        success: true,
        message: `Expertise level updated to ${level}`,
        expertise: this
    };
};

// Method to verify expertise (by admin)
expertiseSchema.methods.verify = async function (adminId) {
    this.verified = true;
    this.verifiedBy = adminId;
    this.verifiedAt = new Date();
    
    await this.save();
    
    return {
        success: true,
        message: 'Expertise verified successfully',
        expertise: this
    };
};

// Method to add certification
expertiseSchema.methods.addCertification = async function (certification) {
    this.certifications.push({
        name: certification.name,
        issuer: certification.issuer,
        dateObtained: certification.dateObtained || new Date()
    });
    
    await this.save();
    
    return {
        success: true,
        message: 'Certification added successfully',
        expertise: this
    };
};

// Static method to get all expertise for a tutor
expertiseSchema.statics.getExpertiseByTutor = async function (tutorId, options = {}) {
    const { populate = true } = options;
    
    let query = this.find({ tutorID: tutorId });
    
    if (populate) {
        query = query
            .populate('moduleID', 'name code description')
            .populate('verifiedBy', 'username email');
    }
    
    return await query.sort({ expertiseLevel: -1, createdAt: -1 });
};

// Static method to get tutors by module
expertiseSchema.statics.getTutorsByModule = async function (moduleId, options = {}) {
    const { minLevel = null, verifiedOnly = false, populate = true } = options;
    
    const query = { moduleID: moduleId };
    
    if (minLevel) {
        const levelOrder = Object.values(ExpertiseLevel);
        const minIndex = levelOrder.indexOf(minLevel);
        if (minIndex !== -1) {
            query.expertiseLevel = { $in: levelOrder.slice(minIndex) };
        }
    }
    
    if (verifiedOnly) {
        query.verified = true;
    }
    
    let result = this.find(query);
    
    if (populate) {
        result = result.populate('tutorID', 'username email userType');
    }
    
    return await result.sort({ expertiseLevel: -1, verified: -1 });
};

// Static method to find or create expertise
expertiseSchema.statics.findOrCreate = async function (tutorId, moduleId, expertiseLevel = ExpertiseLevel.BEGINNER) {
    let expertise = await this.findOne({
        tutorID: tutorId,
        moduleID: moduleId
    });
    
    if (expertise) {
        return {
            found: true,
            expertise
        };
    }
    
    expertise = new this({
        tutorID: tutorId,
        moduleID: moduleId,
        expertiseLevel
    });
    
    await expertise.save();
    
    return {
        found: false,
        created: true,
        expertise
    };
};

// Static method to get expert tutors (Advanced or Expert level)
expertiseSchema.statics.getExpertTutors = async function (moduleId = null) {
    const query = {
        expertiseLevel: { $in: [ExpertiseLevel.ADVANCED, ExpertiseLevel.EXPERT] },
        verified: true
    };
    
    if (moduleId) {
        query.moduleID = moduleId;
    }
    
    return await this.find(query)
        .populate('tutorID', 'username email')
        .populate('moduleID', 'name code')
        .sort({ expertiseLevel: -1 });
};

// Static method to get statistics
expertiseSchema.statics.getStatistics = async function (tutorId = null) {
    const match = tutorId ? { tutorID: mongoose.Types.ObjectId(tutorId) } : {};
    
    const stats = await this.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$expertiseLevel',
                count: { $sum: 1 }
            }
        }
    ]);
    
    const total = await this.countDocuments(match);
    const verified = await this.countDocuments({ ...match, verified: true });
    
    return {
        total,
        verified,
        byLevel: stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {})
    };
};

// Virtual to get expertise as numeric value for sorting
expertiseSchema.virtual('expertiseValue').get(function () {
    const levels = Object.values(ExpertiseLevel);
    return levels.indexOf(this.expertiseLevel);
});

// Ensure virtuals are included in JSON
expertiseSchema.set('toJSON', { virtuals: true });
expertiseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Expertise', expertiseSchema);
module.exports.ExpertiseLevel = ExpertiseLevel;
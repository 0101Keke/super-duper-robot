
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    ModuleCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        maxlength: 20
    },

    ModuleName: {
        type: String,
        required: true,
        maxlength: 200
    },

    description: {
        type: String,
        maxlength: 1000
    },

    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    credits: {
        type: Number,
        min: 0,
        default: 3
    },

    semester: {
        type: String,
        enum: ['Autumn', 'Spring', 'Summer', '1', '2'],
        required: true
    },

    year: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

moduleSchema.index({ code: 1 });
moduleSchema.index({ courseID: 1, year: 1, semester: 1 });

// Static method to get available tutors for this module
moduleSchema.statics.getAvailableTutors = async function (moduleId) {
    const Expertise = mongoose.model('Expertise');
    return await Expertise.getTutorsByModule(moduleId, {
        verifiedOnly: true,
        populate: true
    });
};
moduleSchema.methods.getFAQs = async function (options = {}) {
    const FAQ = mongoose.model('FAQ');
    return await FAQ.getFAQsByModule(this._id, options);
};

// Method to add FAQ to module
moduleSchema.methods.addFAQ = async function (question, answer, createdBy = null) {
    const FAQ = mongoose.model('FAQ');
    
    const faq = new FAQ({
        question,
        answer,
        moduleID: this._id,
        createdBy
    });
    
    await faq.save();
    return faq;
};

// Static method to get modules with most FAQs
moduleSchema.statics.getModulesWithMostFAQs = async function (limit = 10) {
    const FAQ = mongoose.model('FAQ');
    
    const result = await FAQ.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: '$moduleID',
                faqCount: { $sum: 1 }
            }
        },
        { $sort: { faqCount: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'modules',
                localField: '_id',
                foreignField: '_id',
                as: 'module'
            }
        },
        { $unwind: '$module' }
    ]);
    
    return result;
};

module.exports = mongoose.model('Module', moduleSchema);
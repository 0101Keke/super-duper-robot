// models/Escalation.js
const mongoose = require('mongoose');

// Enum for escalation status
const EscalationStatus = {
    PENDING: 'PENDING',
    ASSIGNED: 'ASSIGNED',
    RESOLVED: 'RESOLVED'
};

const escalationSchema = new mongoose.Schema({
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    tutorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null  // Nullable - assigned later
    },

    queryText: {
        type: String,
        required: true
    },

    escalationDate: {
        type: Date,
        default: Date.now,
        required: true
    },

    status: {
        type: String,
        enum: Object.values(EscalationStatus),
        default: EscalationStatus.PENDING,
        required: true
    },

    // Additional helpful fields
    assignedDate: {
        type: Date,
        default: null
    },

    resolvedDate: {
        type: Date,
        default: null
    },

    resolution: {
        type: String,
        default: null
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

// Indexes for faster queries
escalationSchema.index({ status: 1, escalationDate: -1 });
escalationSchema.index({ tutorID: 1, status: 1 });
escalationSchema.index({ studentID: 1 });

// Method to assign a tutor to this escalation
escalationSchema.methods.assignTutor = async function (tutor) {
    // Validate tutor
    if (!tutor) {
        throw new Error('Tutor is required');
    }

    // Check if tutor is actually a tutor
    if (tutor.userType !== 'Tutor') {
        throw new Error('User must be a tutor to be assigned');
    }

    // Check if already assigned
    if (this.status === EscalationStatus.ASSIGNED || this.status === EscalationStatus.RESOLVED) {
        throw new Error(`Cannot assign tutor. Escalation is already ${this.status.toLowerCase()}`);
    }

    // Assign the tutor
    this.tutorID = tutor._id;
    this.status = EscalationStatus.ASSIGNED;
    this.assignedDate = new Date();

    await this.save();
    
    return {
        success: true,
        message: `Tutor ${tutor.username} assigned successfully`,
        escalation: this
    };
};

// Method to resolve the escalation
escalationSchema.methods.resolve = async function (resolution = null) {
    // Check if escalation is already resolved
    if (this.status === EscalationStatus.RESOLVED) {
        throw new Error('Escalation is already resolved');
    }

    // Check if tutor is assigned
    if (!this.tutorID) {
        throw new Error('Cannot resolve escalation without assigned tutor');
    }

    // Resolve the escalation
    this.status = EscalationStatus.RESOLVED;
    this.resolvedDate = new Date();
    
    if (resolution) {
        this.resolution = resolution;
    }

    await this.save();

    return {
        success: true,
        message: 'Escalation resolved successfully',
        escalation: this
    };
};

// Static method to get pending escalations
escalationSchema.statics.getPendingEscalations = async function () {
    return await this.find({ status: EscalationStatus.PENDING })
        .populate('studentID', 'username email')
        .sort({ escalationDate: 1 });  // Oldest first
};

// Static method to get escalations assigned to a tutor
escalationSchema.statics.getEscalationsByTutor = async function (tutorId, status = null) {
    const query = { tutorID: tutorId };
    
    if (status) {
        query.status = status;
    }

    return await this.find(query)
        .populate('studentID', 'username email')
        .sort({ escalationDate: -1 });
};

// Static method to get escalations by student
escalationSchema.statics.getEscalationsByStudent = async function (studentId) {
    return await this.find({ studentID: studentId })
        .populate('tutorID', 'username email')
        .sort({ escalationDate: -1 });
};

// Static method to get escalation statistics
escalationSchema.statics.getStatistics = async function () {
    const total = await this.countDocuments();
    const pending = await this.countDocuments({ status: EscalationStatus.PENDING });
    const assigned = await this.countDocuments({ status: EscalationStatus.ASSIGNED });
    const resolved = await this.countDocuments({ status: EscalationStatus.RESOLVED });

    return {
        total,
        pending,
        assigned,
        resolved,
        percentageResolved: total > 0 ? ((resolved / total) * 100).toFixed(2) : 0
    };
};

// Virtual to check if escalation is overdue (pending for more than 24 hours)
escalationSchema.virtual('isOverdue').get(function () {
    if (this.status !== EscalationStatus.PENDING) return false;
    
    const hoursSinceEscalation = (Date.now() - this.escalationDate) / (1000 * 60 * 60);
    return hoursSinceEscalation > 24;
});

// Virtual to get time elapsed
escalationSchema.virtual('timeElapsed').get(function () {
    const now = Date.now();
    const start = this.escalationDate;
    const hours = Math.floor((now - start) / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} day(s) ${hours % 24} hour(s)`;
    }
    return `${hours} hour(s)`;
});

// Ensure virtuals are included in JSON
escalationSchema.set('toJSON', { virtuals: true });
escalationSchema.set('toObject', { virtuals: true });

// Export the model and enum
module.exports = mongoose.model('Escalation', escalationSchema);
module.exports.EscalationStatus = EscalationStatus;
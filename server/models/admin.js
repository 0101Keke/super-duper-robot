
const mongoose = require('mongoose');
const User = require('./User');

// Admin schema extends User schema
const adminSchema = new mongoose.Schema({
    permissions: [{
        type: String,
        enum: ['manage_users', 'moderate_content', 'view_analytics', 'manage_posts'],
        default: ['manage_users', 'moderate_content']
    }],
    
    department: {
        type: String,
        maxlength: 100
    }
}, {
    timestamps: true
});

// Method to manage users
adminSchema.methods.manageUser = async function (user, action) {
    // Validate inputs
    if (!user || !action) {
        throw new Error('User and action are required');
    }

    // Check if admin has permission
    if (!this.permissions.includes('manage_users')) {
        throw new Error('No permission to manage users');
    }

    switch(action.toLowerCase()) {
        case 'ban':
            user.status = 'banned';
            user.bannedAt = new Date();
            user.bannedBy = this._id;
            break;
        
        case 'unban':
            user.status = 'active';
            user.bannedAt = null;
            user.bannedBy = null;
            break;
        
        case 'delete':
            user.deletedAt = new Date();
            user.deletedBy = this._id;
            await user.save();
            return { success: true, message: 'User deleted successfully' };
        
        case 'promote':
            user.userType = 'Admin';
            break;
        
        case 'demote':
            user.userType = 'Student';
            break;
        
        default:
            throw new Error('Invalid action. Valid actions: ban, unban, delete, promote, demote');
    }

    await user.save();
    return { success: true, message: `User ${action}ed successfully`, user };
};

// Method to moderate content (posts)
adminSchema.methods.moderateContent = async function (post) {
    // Validate input
    if (!post) {
        throw new Error('Post is required');
    }

    // Check if admin has permission
    if (!this.permissions.includes('moderate_content')) {
        throw new Error('No permission to moderate content');
    }

    // Moderate the post
    post.moderated = true;
    post.moderatedBy = this._id;
    post.moderatedAt = new Date();
    
    await post.save();
    return { success: true, message: 'Content moderated successfully', post };
};

// Additional admin methods
adminSchema.methods.approveContent = async function (post) {
    if (!this.permissions.includes('moderate_content')) {
        throw new Error('No permission to moderate content');
    }

    post.status = 'approved';
    post.approvedBy = this._id;
    post.approvedAt = new Date();
    
    await post.save();
    return { success: true, message: 'Content approved successfully', post };
};

adminSchema.methods.rejectContent = async function (post, reason) {
    if (!this.permissions.includes('moderate_content')) {
        throw new Error('No permission to moderate content');
    }

    post.status = 'rejected';
    post.rejectedBy = this._id;
    post.rejectedAt = new Date();
    post.rejectionReason = reason || 'No reason provided';
    
    await post.save();
    return { success: true, message: 'Content rejected successfully', post };
};

// Static method to get all admins
adminSchema.statics.getAllAdmins = async function () {
    return await this.find({ userType: 'Admin' });
};

// Admin inherits from User using discriminator
const Admin = User.discriminator('Admin', adminSchema);

module.exports = Admin;
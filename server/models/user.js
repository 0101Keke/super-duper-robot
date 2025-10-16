const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['Student', 'Tutor', 'Admin'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'banned', 'suspended'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
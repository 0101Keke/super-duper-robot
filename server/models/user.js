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

// Hashing password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
});

/*userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => result);
};*/

//Method Skeletons
userSchema.methods.register = function (username, email, password) {
};

userSchema.methods.login = function (email, password) {
};

userSchema.methods.logout = function () {
// Method to compare password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
};

}
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, minlength: 6 },
    role:      { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
    status:    { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
    isApproved:{ type: Boolean, default: false },
    profilePicture: { type: String, default: '' }
  },
  { timestamps: true }
);

// Hash password before save if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Compare candidate password
UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Idempotent export to avoid OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
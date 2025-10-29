const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const fullName = req.body.fullName || req.body.name; // accept either name field
    const { email, password, role } = req.body || {};

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already in use.' });

    // If your User schema hashes in a pre-save hook, passing plain `password` is fine.
    const user = await User.create({
      fullName,
      email,
      password,
      role: role || 'student',
      status: 'active'
    });

    const token = jwt.sign({ user: { id: user._id, role: user.role } }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.status === 'banned' || user.status === 'suspended') {
            return res.status(403).json({ message: `Account is ${user.status}` });
        }

        // For tutors, check if approved
        if (user.role === 'tutor' && !user.isApproved) {
            return res.status(403).json({ message: 'Account pending approval' });
        }

        // Generate token
        const token = jwt.sign(
            { user: { id: user._id, role: user.role } },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
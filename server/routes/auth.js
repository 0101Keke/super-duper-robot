// server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // <-- JWT middleware (sets req.user = { id, role })


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (expects user.comparePassword to be defined in the model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Account gates
    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }
    if (user.role === 'tutor' && !user.isApproved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    // Generate JWT (payload shape stays consistent with your middleware)
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Login response
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

/**
 * GET /api/auth/me
 * Auth: Bearer token (Authorization header) or x-auth-token
 * Returns minimal profile for the logged-in user
 */
router.get('/me', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id)
      .select('_id name fullName email role courses');

    if (!me) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: me._id,
      name: me.name || me.fullName || '',
      email: me.email,
      role: me.role,
      courses: me.courses || []
    });
  } catch (e) {
    console.error('AUTH /me ERROR:', e);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;

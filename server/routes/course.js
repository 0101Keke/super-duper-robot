const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course'); // Create this model if missing

// Get all enrolled courses for logged-in student
router.get('/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('courses');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.courses);
  } catch (err) {
    console.error('Courses fetch error:', err);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

module.exports = router;

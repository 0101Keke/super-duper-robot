const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Student = require('../models/Student');
const User = require('../models/User');

// GET student dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const student = await Student.findOne({ userId });
    const enrolledCourses = await Course.find({ enrolledStudents: userId });

    res.json({
      user,
      student,
      stats: {
        enrolledCourses: enrolledCourses.length,
        completed: enrolledCourses.filter(c => (c.progress.get(userId) || 0) >= 100).length,
        inProgress: enrolledCourses.filter(c => (c.progress.get(userId) || 0) < 100).length,
        totalHours: 12 + enrolledCourses.length * 3 // just an example metric
      },
      courses: enrolledCourses
    });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ message: 'Server error fetching dashboard' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course'); // ensure this model exists

// GET /api/courses  -> list all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({})
      .select('title category instructor thumbnail createdAt updatedAt'); // adjust fields if needed
    res.json(courses);
  } catch (err) {
    console.error('Courses list error:', err);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// GET /api/courses/enrolled  -> logged-in student's enrolled courses
router.get('/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('courses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.courses || []);
  } catch (err) {
    console.error('Courses fetch error:', err);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// GET /api/courses/:id  -> course detail
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error('Course detail error:', err);
    res.status(500).json({ message: 'Server error fetching course' });
  }
});

module.exports = router;

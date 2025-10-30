const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course'); // Create this model if missing
const student = require('../models/Student');

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


//Create a new course
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, tutor, thumbnail, resources } = req.body;
    const course = new Course({ title, description, category, tutor, thumbnail, resources });
    await course.save();
    res.json(course);
  } catch (err) {
    console.error('Course creation error:', err);
    res.status(500).json({ message: 'Server error creating course' });
  }
});

//add student to course
router.post('/:courseId/add-student', async (req, res) => {
  const student = req.body;
  const course = await Course.findById(req.params.courseId);
  course.students.push(student);
  await course.save();
  res.json(course);
});
module.exports = router;

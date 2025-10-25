const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all available courses
router.get('/', auth, async (req, res) => {
  const courses = await Course.find().populate('tutor', 'fullName');
  res.json(courses);
});

// Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (!course.enrolledStudents.includes(req.user.id)) {
    course.enrolledStudents.push(req.user.id);
    await course.save();
  }

  res.json({ message: 'Enrolled successfully', course });
});

module.exports = router;

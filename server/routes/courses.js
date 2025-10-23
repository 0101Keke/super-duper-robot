// server/routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // create Course model
const auth = require('../middleware/auth');

// Create a course (admin or tutor)
router.post('/', auth, async (req, res) => {
  try {
    const { code, title, description } = req.body;
    const course = new Course({ code, title, description, createdBy: req.user.id });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Get courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

module.exports = router;

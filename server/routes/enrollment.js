const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// 📌 Enroll in a course
router.post('/:courseId/enroll', auth, async (req, res) => {
  try {
    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: req.params.courseId
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Get all courses a student is enrolled in
router.get('/my', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title category thumbnail instructor progress');

    res.json(enrollments.map(e => e.course));
  } catch (err) {
    console.error('Get enrolled error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Server error fetching all courses' });
  }
});

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

// ✅ Assign a student to a course (using enrolledStudents)
router.post('/assign', auth, async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    if (!courseId || !studentId) {
      return res.status(400).json({ message: 'Course ID and Student ID are required' });
    }

    const course = await Course.findById(courseId);
    const student = await User.findById(studentId);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Prevent duplicates
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    // Link both sides
    course.enrolledStudents.push(studentId);
    if (!student.courses) student.courses = [];
    student.courses.push(courseId);

    await course.save();
    await student.save();

    res.json({ message: 'Student successfully assigned to course' });
  } catch (err) {
    console.error('Error assigning student:', err);
    res.status(500).json({ message: 'Server error assigning student' });
  }
});

module.exports = router;

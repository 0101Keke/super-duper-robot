const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');

router.get('/student', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const enrolledCourses = await Enrollment.find({ studentId: userId }).populate('courseId');
    const submissions = await Submission.find({ studentId: userId });

    const completedAssignments = submissions.length;
    const totalCourses = enrolledCourses.length;

    res.json({
      totalCourses,
      completedAssignments,
      inProgress: enrolledCourses.filter(e => e.progress < 100).length,
      completedCourses: enrolledCourses.filter(e => e.progress === 100).length,
      studyHours: totalCourses * 5,
      recentCourses: enrolledCourses.slice(0, 3).map(e => ({
        id: e.courseId._id,
        title: e.courseId.title,
        thumbnail: e.courseId.thumbnail,
        category: e.courseId.category
      }))
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

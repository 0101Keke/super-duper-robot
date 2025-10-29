const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');
const isAdmin = auth.isAdmin;

// GET /api/dashboard/stats
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTutors = await User.countDocuments({ role: 'tutor', isApproved: true });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const pendingTutors = await User.countDocuments({ role: 'tutor', isApproved: false });
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ status: 'active' });

        res.json({
            totalUsers,
            totalTutors,
            totalStudents,
            pendingTutors,
            totalCourses,
            activeCourses
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

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
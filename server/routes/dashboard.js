const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
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

module.exports = router;
=======
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');

router.get('/student', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch enrolled courses (safe even if empty)
    const enrollments = await Enrollment.find({ studentId: userId }).populate('courseId').lean();
    const submissions = await Submission.find({ studentId: userId }).populate('assignment').lean();

    // Compute stats safely
    const totalCourses = enrollments.length || 0;
    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const inProgress = enrollments.filter(e => e.progress < 100).length;
    const completedAssignments = submissions.length || 0;

    // Example study hours = 5 hours per course
    const studyHours = totalCourses * 5;

    res.json({
      totalCourses,
      completedCourses,
      inProgress,
      completedAssignments,
      studyHours,
      recentCourses: enrollments.slice(0, 3).map(e => ({
        id: e.courseId?._id,
        title: e.courseId?.title || 'Untitled Course',
        thumbnail: e.courseId?.thumbnail || '/default-course.jpg',
        category: e.courseId?.category || 'General'
      }))
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
>>>>>>> 9438b22f94d925f2ae4224824fd91ef9f7689a10

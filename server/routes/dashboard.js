const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');          // main auth middleware (sets req.user = { id, role })
const isAdmin = auth.isAdmin;                        // admin gate

const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

/**
 * GET /api/dashboard/student
 * Returns dashboard data for the logged-in student.
 */
router.get('/student', auth, async (req, res) => {
  try {
    // Enrolled courses from User.courses (expects courses: [ObjectId] with ref 'Course')
    const me = await User.findById(req.user.id)
      .populate('courses', 'title category instructor thumbnail status');

    const enrolledCourses = me?.courses || [];

    // Upcoming assignments in next 14 days across enrolled courses
    const courseIds = enrolledCourses.map(c => c._id);
    const now = new Date();
    const soon = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const upcomingAssignments = courseIds.length
      ? await Assignment.find({
          course: { $in: courseIds },
          dueDate: { $gte: now, $lte: soon }
        })
          .select('title dueDate course')
          .populate('course', 'title')
          .sort({ dueDate: 1 })
      : [];

    // Recent submissions by this student
    const recentSubmissions = await Submission.find({ student: req.user.id })
      .select('submittedAt grade assignment fileUrl')
      .populate('assignment', 'title course')
      .sort({ submittedAt: -1 })
      .limit(5);

    return res.json({
      enrolledCount: enrolledCourses.length,
      enrolledCourses,
      upcomingAssignments,
      recentSubmissions
    });
  } catch (e) {
    console.error('STUDENT DASH ERROR:', e);
    return res.status(500).json({ message: 'Failed to load student dashboard' });
  }
});

/**
 * GET /api/dashboard/stats
 * Admin metrics (unchanged from your file).
 */
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTutors = await User.countDocuments({ role: 'tutor', isApproved: true });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingTutors = await User.countDocuments({ role: 'tutor', isApproved: false });
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: 'active' });

    return res.json({
      totalUsers,
      totalTutors,
      totalStudents,
      pendingTutors,
      totalCourses,
      activeCourses
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;


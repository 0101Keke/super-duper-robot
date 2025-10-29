const express = require('express');
const router = express.Router();
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

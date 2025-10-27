const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Topic = require('../models/Topic');
const auth = require('../middleware/auth');

// Helper middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', [auth, isAdmin], async (req, res) => {
    try {
        // Get all statistics in parallel for better performance
        const [
            totalUsers,
            totalStudents,
            totalTutors,
            pendingTutors,
            totalCourses,
            activeTopics
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'tutor', isApproved: true }),
            User.countDocuments({ role: 'tutor', isApproved: false }),
            Course.countDocuments({ isActive: true }).catch(() => 0), // Handle if Course model doesn't exist
            Topic.countDocuments().catch(() => 0) // Handle if Topic model doesn't exist
        ]);

        res.json({
            totalUsers,
            totalStudents,
            totalTutors,
            pendingTutors,
            totalCourses,
            activeTopics,
            unresolvedReports: 0 // Add report counting when you have a Report model
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
});

// @route   GET /api/admin/users/recent
// @desc    Get recent users
// @access  Private (Admin only)
router.get('/users/recent', [auth, isAdmin], async (req, res) => {
    try {
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-password');

        res.json(recentUsers);
    } catch (error) {
        console.error('Recent users error:', error);
        res.status(500).json({ message: 'Error fetching recent users' });
    }
});

// @route   GET /api/admin/users/tutors/pending
// @desc    Get pending tutor approvals
// @access  Private (Admin only)
router.get('/users/tutors/pending', [auth, isAdmin], async (req, res) => {
    try {
        const pendingTutors = await User.find({
            role: 'tutor',
            isApproved: false
        }).select('-password');

        res.json(pendingTutors);
    } catch (error) {
        console.error('Pending tutors error:', error);
        res.status(500).json({ message: 'Error fetching pending tutors' });
    }
});

// @route   PUT /api/admin/users/tutors/:id/approve
// @desc    Approve a tutor
// @access  Private (Admin only)
router.put('/users/tutors/:id/approve', [auth, isAdmin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role !== 'tutor') {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        user.isApproved = true;
        user.status = 'active';
        await user.save();

        res.json({ message: 'Tutor approved successfully', user });
    } catch (error) {
        console.error('Approve tutor error:', error);
        res.status(500).json({ message: 'Error approving tutor' });
    }
});

// @route   GET /api/admin/reports
// @desc    Get all reports (placeholder for now)
// @access  Private (Admin only)
router.get('/reports', [auth, isAdmin], async (req, res) => {
    try {
        // Return empty array for now until you have a Report model
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

module.exports = router;
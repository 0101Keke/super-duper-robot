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
router.get('/users/all', [auth, isAdmin], async (req, res) => {
    try {
        const users = await User.find()
            .sort({ createdAt: -1 })
            .select('-password');

        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Error fetching all users' });
    }

});
        router.delete('/users/:id', [auth, isAdmin], async (req, res) => {
            try {
                const user = await User.findById(req.params.id);

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Prevent admin from deleting their own account
                if (user._id.toString() === req.user.id) {
                    return res.status(400).json({ message: 'You cannot delete your own account.' });
                }

                await User.findByIdAndDelete(req.params.id);

                res.json({ message: 'User deleted successfully' });
            } catch (error) {
                console.error('Delete user error:', error);
                res.status(500).json({ message: 'Error deleting user' });
            }
        });

        // @route   PUT /api/admin/users/:id/status
        // @desc    Update a user's status (ban/unban)
        // @access  Private (Admin only)
        router.put('/users/:id/status', [auth, isAdmin], async (req, res) => {
            try {
                const { status } = req.body;

                if (status !== 'active' && status !== 'banned') {
                    return res.status(400).json({ message: 'Invalid status.' });
                }

                const user = await User.findById(req.params.id);

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Prevent admin from banning themself
                if (user._id.toString() === req.user.id) {
                    return res.status(400).json({ message: 'You cannot change your own status.' });
                }

                user.status = status;
                await user.save();

                res.json({ message: 'User status updated successfully', user });
            } catch (error) {
                console.error('Update user status error:', error);
                res.status(500).json({ message: 'Error updating user status' });
            }
        });
   
router.get('/tutors', [auth, isAdmin], async (req, res) => {
    try {
        const tutors = await User.find({ role: 'tutor', isApproved: true })
            .select('fullName username _id'); // Only send necessary info
        res.json(tutors);
    } catch (error) {
        console.error('Get tutors error:', error);
        res.status(500).json({ message: 'Error fetching tutors' });
    }
});


// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Private (Admin only)
router.post('/courses', [auth, isAdmin], async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            level,
            tutor, // This will be the tutor's ID from the form
            price,
            duration,
            code,
            startDate,
            endDate
        } = req.body;

        // Validation
        if (!title || !description || !subject || !level || !tutor || !duration || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please fill out all required fields.' });
        }

        const newCourse = new Course({
            title,
            description,
            subject,
            level,
            tutor, // The ID of the selected tutor
            price: price || 0, // Use default if price isn't provided
            duration,
            code,
            startDate,
            endDate,
            // The model seems to care about the *tutor*, not the admin who created it
            // So we'll use the 'tutor' field from the request body
        });

        const course = await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course });

    } catch (error) {
        console.error('Create course error:', error);
        if (error.name === 'ValidationError') {
            // Send back specific validation errors
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error creating course' });
    }
});





module.exports = router;
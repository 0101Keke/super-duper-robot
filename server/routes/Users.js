const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const isAdmin = auth.isAdmin;

// GET /api/users/recent - Get recent users
router.get('/recent', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-password');

        res.json(users);
    } catch (error) {
        console.error('Error fetching recent users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// GET /api/users/pending-tutors - Get tutors pending approval
router.get('/pending-tutors', auth, isAdmin, async (req, res) => {
    try {
        const tutors = await User.find({
            role: 'tutor',
            isApproved: false
        })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(tutors);
    } catch (error) {
        console.error('Error fetching pending tutors:', error);
        res.status(500).json({ message: 'Error fetching tutors', error: error.message });
    }
});

// PUT /api/users/approve-tutor/:id - Approve a tutor
router.put('/approve-tutor/:id', auth, isAdmin, async (req, res) => {
    try {
        const tutor = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).select('-password');

        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        res.json({ message: 'Tutor approved successfully', tutor });
    } catch (error) {
        console.error('Error approving tutor:', error);
        res.status(500).json({ message: 'Error approving tutor', error: error.message });
    }
});

// GET /api/users - Get all users
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

module.exports = router;
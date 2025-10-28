// server/routes/dashboard.js
const express = require('express');
const router = express.Router();  
const auth = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');

// Student dashboard stats
router.get('/student', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        const student = await Student.findOne({ userId });
        const enrolledCourses = await Course.find({
            enrolledStudents: userId
        });

        res.json({
            user,
            student,
            stats: {
                enrolledCourses: enrolledCourses.length,
                completed: enrolledCourses.filter(c =>
                    (c.progress?.get(userId) || 0) >= 100
                ).length,
                inProgress: enrolledCourses.filter(c =>
                    (c.progress?.get(userId) || 0) < 100
                ).length
            },
            courses: enrolledCourses
        });
    } catch (err) {
        console.error('Student dashboard error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Tutor dashboard stats
router.get('/tutor', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const courses = await Course.find({ tutor: userId });

        res.json({
            stats: {
                totalCourses: courses.length,
                totalStudents: courses.reduce((sum, c) =>
                    sum + c.enrolledStudents.length, 0
                ),
                activeCourses: courses.filter(c => c.status === 'active').length
            },
            courses
        });
    } catch (err) {
        console.error('Tutor dashboard error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});





module.exports = router;
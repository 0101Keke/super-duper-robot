const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const isAdmin = auth.isAdmin;
const isTutor = auth.isTutor;

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
    try {
        const { subject, level, status } = req.query;
        let filter = { isPublished: true };

        if (subject) filter.subject = subject;
        if (level) filter.level = level;
        if (status) filter.status = status;

        const courses = await Course.find(filter)
            .populate('tutor', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

// GET /api/courses/:id - Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('tutor', 'fullName email phone')
            .populate('enrolledStudents', 'fullName email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
});

// POST /api/courses - Create new course (Tutors only)
router.post('/', auth, isTutor, async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            level,
            price,
            duration,
            maxStudents,
            schedule,
            startDate,
            endDate,
            syllabus
        } = req.body;

        // Verify the tutor is approved
        const tutor = await User.findById(req.user.id);
        if (!tutor || !tutor.isApproved) {
            return res.status(403).json({ message: 'Only approved tutors can create courses' });
        }

        const course = new Course({
            title,
            description,
            subject,
            level,
            tutor: req.user.id,
            price,
            duration,
            maxStudents,
            schedule,
            startDate,
            endDate,
            syllabus
        });

        await course.save();
        await course.populate('tutor', 'fullName email');

        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});

// PUT /api/courses/:id - Update course (Tutor/Admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findById(req.user.id);

        // Check if user is the tutor or admin
        if (course.tutor.toString() !== req.user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('tutor', 'fullName email');

        res.json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Error updating course', error: error.message });
    }
});

// DELETE /api/courses/:id - Delete course (Tutor/Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findById(req.user.id);

        // Check if user is the tutor or admin
        if (course.tutor.toString() !== req.user.id && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
});

// POST /api/courses/:id/enroll - Enroll in a course (Students only)
router.post('/:id/enroll', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if course is full
        if (course.enrolledStudents.length >= course.maxStudents) {
            return res.status(400).json({ message: 'Course is full' });
        }

        // Check if already enrolled
        if (course.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        course.enrolledStudents.push(req.user.id);
        await course.save();

        res.json({ message: 'Successfully enrolled in course', course });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
});

// GET /api/courses/tutor/:tutorId - Get courses by tutor
router.get('/tutor/:tutorId', async (req, res) => {
    try {
        const courses = await Course.find({ tutor: req.params.tutorId })
            .populate('tutor', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        console.error('Error fetching tutor courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

// GET /api/courses/my-courses - Get logged-in tutor's courses
router.get('/my/courses', auth, isTutor, async (req, res) => {
    try {
        const courses = await Course.find({ tutor: req.user.id })
            .populate('enrolledStudents', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        console.error('Error fetching my courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

module.exports = router;
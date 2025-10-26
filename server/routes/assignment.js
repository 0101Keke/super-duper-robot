const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Setup upload folder
const uploadDir = path.join(__dirname, '..', 'uploads', 'assignments');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// POST /assignments/:courseId/:assignmentId/submit
router.post('/:courseId/:assignmentId/submit', auth, upload.single('file'), async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    const assignment = course.assignments.id(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.submissions.push({
      student: req.user.id,
      fileUrl: `/uploads/assignments/${req.file.filename}`,
      submittedAt: new Date()
    });

    await course.save();
    res.json({ message: 'Submission uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

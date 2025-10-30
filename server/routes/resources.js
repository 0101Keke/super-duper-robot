const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Upload folder
const resourceDir = path.join(__dirname, '..', 'uploads', 'resources');
if (!fs.existsSync(resourceDir)) fs.mkdirSync(resourceDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resourceDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// 📤 Upload a resource (Tutor only)
router.post('/upload/:courseId', auth, upload.single('file'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const resource = {
      name: req.file.originalname,
      type: path.extname(req.file.originalname).replace('.', '').toUpperCase(),
      url: `/uploads/resources/${req.file.filename}`,
      uploadedAt: new Date()
    };

    course.resources = course.resources || [];
    course.resources.push(resource);
    await course.save();

    res.json({ message: 'Resource uploaded successfully', resource });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 📚 Get all resources for a course
router.get('/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).select('resources title');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({
      courseTitle: course.title,
      resources: course.resources || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

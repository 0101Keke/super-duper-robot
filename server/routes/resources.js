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

// POST /resources/upload/:courseId
router.post('/upload/:courseId', auth, upload.single('file'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const resource = {
      name: req.file.originalname,
      type: path.extname(req.file.originalname).replace('.', ''),
      url: `/uploads/resources/${req.file.filename}`
    };

    course.resources.push(resource);
    await course.save();

    res.json({ message: 'Resource uploaded successfully', resource });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /resources/:courseId
router.get('/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).select('resources');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

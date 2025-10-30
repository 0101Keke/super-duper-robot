const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require('../models/Course');
const Resources = require('../models/Resources');
const auth = require('../middleware/auth');

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resources.find();
    res.json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ message: 'Server error fetching resources' });
  }
});

// Upload folder
const resourceDir = path.join(__dirname, '..', 'uploads', 'resources');
if (!fs.existsSync(resourceDir)) fs.mkdirSync(resourceDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resourceDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// POST /resources - Create a new resource
router.post('/', auth, async (req, res) => {
  try {
    const { title, type = 'OTHER', tutorId, topicId } = req.body;
    
    const resource = new Resources({
      title,
      type,
      filePath: req.body.url, // Using url as filePath for now
      tutorId,
      topicId
    });

    await resource.save();

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

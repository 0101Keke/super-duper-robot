const express = require('express');
const router = express.Router();
const auth = require('../routes/auth');
const upload = require('../routes/upload');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// 📤 Submit assignment
router.post('/:assignmentId/submit', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const submission = new Submission({
      assignment: req.params.assignmentId,
      student: req.user.id,
      fileUrl: `/uploads/submissions/${req.file.filename}`,
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📥 Get all submissions by current student
router.get('/my', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate('assignment');
    res.json(submissions);
  } catch (err) {
    console.error('Get submissions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

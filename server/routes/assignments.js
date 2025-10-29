const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📁 Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/assignments');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ================================
// 📌 ROUTES
// ================================

// 1️⃣ Get all assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('createdBy', 'fullName email')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2️⃣ Submit an assignment
router.post('/:assignmentId/submit', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No file uploaded' });

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment)
      return res.status(404).json({ message: 'Assignment not found' });

    // Create submission
    const submission = new Submission({
      assignment: assignment._id,
      student: req.user.id,
      fileUrl: `/uploads/assignments/${req.file.filename}`,
    });
    await submission.save();

    res.json({
      message: '✅ Assignment submitted successfully!',
      submission,
    });
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3️⃣ Get submissions for a student
router.get('/my/submissions', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate('assignment', 'title dueDate')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

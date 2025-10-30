const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const auth = require('../middleware/auth');

// Create a discussion topic
router.post('/:courseId', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const discussion = new Discussion({
      course: req.params.courseId,
      title,
      content,
      author: req.user.id
    });
    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: 'Error creating discussion', error: err.message });
  }
});

// Get discussions for a course
router.get('/:courseId', auth, async (req, res) => {
  try {
    const discussions = await Discussion.find({ course: req.params.courseId }).populate('author', 'fullName');
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching discussions' });
  }
});

// Add comment
router.post('/:discussionId/comment', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId);
    discussion.comments.push({
      author: req.user.id,
      content: req.body.content
    });
    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

//replies in discussion
router.post('/:discussionId/reply', async (req, res) => {
  const discussion = await Discussion.findById(req.params.discussionId);
  discussion.replies.push({ userId: req.body.userId, content: req.body.content });
  await discussion.save();
  res.json(discussion);
});

module.exports = router;

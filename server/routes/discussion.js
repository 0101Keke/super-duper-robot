const express = require("express");
const router = express.Router();
const Discussion = require("../models/Discussion");

// Create new discussion
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newDiscussion = new Discussion({ title, content, author });
    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (err) {
    res.status(500).json({ message: "Error creating discussion", error: err.message });
  }
});

// Get all discussions
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching discussions", error: err.message });
  }
});

// Get single discussion + replies
router.get("/:id", async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("author", "name email")
      .populate("replies.author", "name email");
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ message: "Error fetching discussion", error: err.message });
  }
});

// Add reply
router.post("/:id/reply", async (req, res) => {
  try {
    const { content, author } = req.body;
    const discussion = await Discussion.findById(req.params.id);
    discussion.replies.push({ content, author });
    await discussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ message: "Error adding reply", error: err.message });
  }
});

module.exports = router;

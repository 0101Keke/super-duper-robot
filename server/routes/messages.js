const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Send message
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const msg = new Message({ sender, receiver, message });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
});

// Get conversation between two users
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

module.exports = router;

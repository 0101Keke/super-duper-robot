const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('./auth'); // if your auth middleware is also in routes
const User = require('../models/User');

// Message model
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// ✅ Get all users (for contact list)
router.get('/contacts', async (req, res) => {
  try {
    const users = await User.find({}, '_id name email role');
    res.json(users);
  } catch (err) {
    console.error('Contacts fetch error:', err);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
});

// ✅ Fetch conversation between two users
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  if (!user1 || !user2) {
    return res.status(400).json({ message: 'Both user IDs required' });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// ✅ Send a message
router.post('/', async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    if (!sender || !receiver || !message)
      return res.status(400).json({ message: 'Missing sender, receiver, or message' });

    const newMsg = await Message.create({ sender, receiver, message });
    const populated = await newMsg.populate('sender', 'name email');
    res.json(populated);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;

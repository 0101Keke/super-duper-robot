// server/models/Discussion.js
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Discussion", discussionSchema);

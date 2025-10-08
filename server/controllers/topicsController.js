const Joi = require('joi');
const Topic = require('../models/topic');
const User = require('../models/user');

const topicSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  moduleCode: Joi.string().required()
});

exports.getTopics = async (req, res) => {
  const topics = await Topic.find().populate('creator','name email role').sort({ createdAt: -1 }).limit(100);
  res.json(topics);
};

exports.createTopic = async (req, res) => {
  const { error, value } = topicSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const topic = new Topic({ ...value, creator: req.user._id });
  await topic.save();

  // notify subscribers / use sendgrid or internal notify (omitted for brevity)
  res.status(201).json(topic);
};

exports.subscribe = async (req, res) => {
  const topicId = req.params.id;
  const topic = await Topic.findById(topicId);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  if (!topic.subscribers.includes(req.user._id)) {
    topic.subscribers.push(req.user._id);
    await topic.save();
  }
  res.json({ message: 'Subscribed' });
};

// Tutor marks resolved
exports.markResolved = async (req,res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) return res.status(404).json({ message:'Not found' });
  topic.status = 'Resolved';
  await topic.save();
  res.json({ message: 'Marked resolved', topic });
};

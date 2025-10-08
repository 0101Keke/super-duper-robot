const Joi = require('joi');
const Resource = require('../models/resource');
const Topic = require('../models/topic');

const resourceSchema = Joi.object({
  title: Joi.string().required(),
  filePath: Joi.string().required(),
  type: Joi.string().valid('PDF','Video','Audio','Link','Other').required(),
  topicId: Joi.string().required()
});

// File upload in production would use S3/Cloudinary; here we accept filePath (string)
exports.uploadResource = async (req, res) => {
  const { error, value } = resourceSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const topic = await Topic.findById(value.topicId);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  // Only tutors registered for that module should upload in prod; here we check role
  if (req.user.role !== 'tutor') return res.status(403).json({ message: 'Only tutors can upload materials' });

  const resource = new Resource({
    title: value.title,
    filePath: value.filePath,
    type: value.type,
    uploadedBy: req.user._id,
    topic: topic._id
  });
  await resource.save();
  res.status(201).json(resource);
};

exports.getResources = async (req,res) => {
  const resources = await Resource.find().populate('uploadedBy','name email').sort({ uploadedAt: -1 });
  res.json(resources);
};

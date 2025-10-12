const express = require('express');
const router = express.Router();

// GET all topics
router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'Web Programming', description: 'Discuss HTML, CSS, JS' },
    { id: 2, title: 'Database Systems', description: 'Talk SQL, NoSQL' }
  ]);
});

// POST a new topic
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Missing title or description' });
  }
  res.status(201).json({ message: 'Topic created successfully', topic: { title, description } });
});

module.exports = router;
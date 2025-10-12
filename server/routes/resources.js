const express = require('express');
const router = express.Router();

// GET resources
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'CampusLearn Guide', url: 'https://campuslearn.edu/resources/guide.pdf' },
    { id: 2, name: 'Machine Learning Notes', url: 'https://campuslearn.edu/resources/ml-notes.pdf' }
  ]);
});

// Placeholder routes
router.get('/', (req, res) => {
    res.json({ message: 'Get all resources' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Upload resource' });
});

module.exports = router;
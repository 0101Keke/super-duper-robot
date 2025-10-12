const express = require('express');
const router = express.Router();

// Placeholder routes
router.get('/', (req, res) => {
    res.json({ message: 'Get all resources' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Upload resource' });
});

module.exports = router;
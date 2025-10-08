const express = require('express');
const router = express.Router();
const resources = require('../controllers/resourcesController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, resources.getResources);
router.post('/upload', authMiddleware, resources.uploadResource);

module.exports = router;

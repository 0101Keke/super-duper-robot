const express = require('express');
const router = express.Router();
const topics = require('../controllers/topicsController');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

router.get('/', authMiddleware, topics.getTopics);
router.post('/', authMiddleware, topics.createTopic);
router.post('/:id/subscribe', authMiddleware, topics.subscribe);
router.post('/:id/resolve', authMiddleware, authorizeRoles('tutor','admin'), topics.markResolved);

module.exports = router;

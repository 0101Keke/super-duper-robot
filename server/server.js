require('dotenv').config();
const express = require('express');
const router = express.Router();
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');

const Tutor = require('./models/Tutor');
const Topic = require('./models/Topic');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to DB
connectDB(process.env.MONGO_URI);

// Routes
router.post('/tutors/:id/topics/:topicId/response', async (req, res) => {
  // route logic here
});
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/topics', require('./routes/topics'));
app.use('/api/v1/resources', require('./routes/resources'));
app.use('/api', router);

// Health check
app.get('/api/v1/ping', (req, res) => res.json({ pong: true }));

// Error handling middleware
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
require('dotenv').config();
const express = require('express');
const router = express.Router();
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');
app.use('/api/chatbot', require('./routes/chatbot'));


const Tutor = require('./models/Tutor');
const Topic = require('./models/topic');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to DB
connectDB(process.env.MONGODB_URI);


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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/resources', require('./routes/resources'));

// Error handling middleware
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
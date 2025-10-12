require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to DB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/topics', require('./routes/topics'));
app.use('/api/v1/resources', require('./routes/resources'));

// Health check
app.get('/api/v1/ping', (req, res) => res.json({ pong: true }));

// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
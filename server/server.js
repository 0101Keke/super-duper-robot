const express = require('express');
const connectDb = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path')

dotenv.config();

connectDb();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Your React app URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
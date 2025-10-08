require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');

// Initialize app
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to DB
connectDB();

// routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/topics', require('./routes/topics'));
app.use('/api/v1/resources', require('./routes/resources'));

// health
app.get('/api/v1/ping', (req,res) => res.json({pong:true}));

// error handling
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));

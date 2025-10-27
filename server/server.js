require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');
const path = require('path');

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);


app.use('/api/auth', require('./routes/auth'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/admin', require('./routes/admin'));


app.get('/api/ping', (req, res) => res.json({ pong: true }));

// Error handling middleware 
app.use(errorHandler);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/Users'));
app.use('/api/coursers', require('./routes/coursers'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
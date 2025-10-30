require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');

// Route imports
const studentRoutes = require('./routes/student');
const courseRoutes = require('./routes/course');
const assignmentRoutes = require('./routes/assignments');
const resourceRoutes = require('./routes/resources');
const discussionRoutes = require('./routes/discussion');
const profileRoutes = require('./routes/profile');
const usersRouter = require('./routes/users');

const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/resources', resourceRoutes);
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/enrollments', require('./routes/enrollment'));
app.use('/api/submissions', require('./routes/submission'));
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/users', usersRouter);
app.use('/api/dashboard', require('./routes/dashboard'));
app.use("/api/messages", require("./routes/messages"));

// ✅ Test route
app.get('/api/ping', (req, res) => res.json({ pong: true }));

// ✅ Error Handling
app.use(errorHandler);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

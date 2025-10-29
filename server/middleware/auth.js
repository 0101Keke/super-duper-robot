const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main authentication middleware
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    let token;

    // Accept either Bearer token or x-auth-token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.header('x-auth-token')) {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Admin check middleware
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin only.' });
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Tutor check middleware
const isTutor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'tutor' || !user.isApproved) return res.status(403).json({ message: 'Access denied. Approved tutors only.' });
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Export middlewares
module.exports = auth;
module.exports.isAdmin = isAdmin;
module.exports.isTutor = isTutor;
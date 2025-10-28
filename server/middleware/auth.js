
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main authentication middleware
const auth = function (req, res, next) {
    const authHeader = req.header('Authorization');
    let token = null;

   
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.header('x-auth-token')) {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Admin check middleware 
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tutor check middleware 
const isTutor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'tutor' || !user.isApproved) {
            return res.status(403).json({ message: 'Access denied. Approved tutors only.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = auth;

module.exports.auth = auth;
module.exports.isAdmin = isAdmin;
module.exports.isTutor = isTutor;
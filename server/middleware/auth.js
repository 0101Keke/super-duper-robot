const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }

        //Ensures JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Validates decoded token structure
        if (!decoded.userId || !decoded.userType) {
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        req.userId = decoded.userId;
        req.userType = decoded.userType;
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(401).json({ message: 'Authentication failed' });
    }
};

//Role-based authorization
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userType) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!allowedRoles.includes(req.userType)) {
            return res.status(403).json({
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

//Specific roles access
const isStudent = (req, res, next) => {
    if (req.userType !== 'Student') {
        return res.status(403).json({ message: 'Access denied. Student only.' });
    }
    next();
};

const isTutor = (req, res, next) => {
    if (req.userType !== 'Tutor') {
        return res.status(403).json({ message: 'Access denied. Tutor only.' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.userType !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

//Middleware attaches full user object from database
const attachUser = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.userId).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.userObject = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
};

module.exports = {
    auth,
    authorizeRole,
    isStudent,
    isTutor,
    isAdmin,
    attachUser
};
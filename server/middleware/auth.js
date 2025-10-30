
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main authentication middleware
const auth = (req, res, next) => {
<<<<<<< HEAD
  // Accept either Authorization: Bearer <token> or x-auth-token
  const authHeader = req.headers.authorization || '';
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);

    // Support both shapes: { id, role } and { user: { id, role } }
    const id = decoded?.id ?? decoded?.user?.id;
    const role = decoded?.role ?? decoded?.user?.role;

    if (!id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = { id, role: role || 'student' };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin check middleware (AFTER auth)
const isAdmin = async (req, res, next) => {
  try {
    // If role is already in token, this is enough:
    if (req.user?.role === 'admin') return next();

    // Fallback: verify via DB if needed
    const user = await User.findById(req.user.id).select('role');
    if (user && user.role === 'admin') return next();

    return res.status(403).json({ message: 'Access denied. Admin only.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Tutor check middleware (AFTER auth) — needs DB to check isApproved
const isTutor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('role isApproved');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'tutor' && user.isApproved) return next();

    return res.status(403).json({ message: 'Access denied. Approved tutors only.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = auth;
module.exports.isAdmin = isAdmin;
module.exports.isTutor = isTutor;
=======
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
>>>>>>> home-shiva

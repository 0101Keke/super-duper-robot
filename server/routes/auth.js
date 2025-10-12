
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        console.log(' Register request:', req.body);

        const { username, email, password, userType } = req.body;

        // Validate required fields
        if (!username || !email || !password || !userType) {
            return res.status(400).json({ 
                message: 'Please provide username, email, password, and userType' 
            });
        }

        // Check if user exists (check both email and username)
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email or username' 
            });
        }

        // Create user 
        const user = await User.create({
            username,
            email,
            passwordHash: password,  
            userType 
        });

        console.log(' User created:', user._id);

        // Generate token
        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET || 'your-secret-key-change-this',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username, 
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error(' Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed', 
            error: error.message 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login request:', req.body.email);

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password' 
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password (compare with passwordHash field)
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful:', user._id);

        // Generate token
        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET || 'your-secret-key-change-this',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,  
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error(' Login error:', error);
        res.status(500).json({ 
            message: 'Login failed', 
            error: error.message 
        });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'your-secret-key-change-this'
        );
        
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            userType: user.userType
        });
    } catch (error) {
        console.error(' Auth check error:', error);
        res.status(401).json({ message: 'Not authenticated' });
    }
});

module.exports = router;
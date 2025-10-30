// server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // <-- JWT middleware (sets req.user = { id, role })



const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/cvs/';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for CV uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});


router.post('/register', upload.single('cv'), async (req, res) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }
        // Email validation for Belgium Campus students
if (role === 'student') {
  const studentEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.belgiumcampus\.ac\.za$/;
  if (!studentEmailRegex.test(email)) {
    return res.status(400).json({
      message: 'Only @student.belgiumcampus.ac.za emails are allowed for students'
    });
  }
}

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (schema will hash password automatically)
user = new User({
    fullName,
    email: email.toLowerCase(),
    password,
    phone,
    role: role || 'student',
    cv: req.file ? req.file.path : undefined
});

        

        await user.save();
        if (user.role === 'student') {
  const Student = require('../models/Student');
  const newStudent = new Student({
    userId: user._id,
    programme: req.body.programme || 'General Studies',
    yearOfStudy: req.body.yearOfStudy || 1
  });
  await newStudent.save();
  console.log('Student profile created for:', user.email);
}
        console.log('User registered:', user.email);

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role,
                        isApproved: user.isApproved
                    }
                });
            }
        );
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({
            message: 'Server error during registration',
            error: err.message
        });
    }
});



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (expects user.comparePassword to be defined in the model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Account gates
    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }
    if (user.role === 'tutor' && !user.isApproved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    // Generate JWT (payload shape stays consistent with your middleware)
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    router.get('/me', [auth], async (req, res) => {
        try {
            
            const user = await User.findById(req.user.id).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});

/**
 * GET /api/auth/me
 * Auth: Bearer token (Authorization header) or x-auth-token
 * Returns minimal profile for the logged-in user
 */
router.get('/me', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id)
      .select('_id name fullName email role courses');

    if (!me) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: me._id,
      name: me.name || me.fullName || '',
      email: me.email,
      role: me.role,
      courses: me.courses || []
    });
  } catch (e) {
    console.error('AUTH /me ERROR:', e);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;

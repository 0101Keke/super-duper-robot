const express = require('express');
const router = express.Router();

// Example login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === '12345') {
    return res.status(200).json({ message: 'Login successful', token: 'mock-token-123' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Example register route
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  return res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;

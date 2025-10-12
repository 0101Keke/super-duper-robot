const express = require('express');
const router = express.Router();


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.checkPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);  //log error for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Example register route
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  return res.status(201).json({ message: 'User registered successfully' });
});

router.post('/tutors/:id/topics/:topicId/response', async (req, res) => {
  const { id, topicId } = req.params;
  const { response } = req.body;
  try {
    const tutor = await Tutor.findById(id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    const responseDoc = {
      response,
      createdAt: Date.now(),
      tutor: {
        id: tutor._id,
        name: tutor.name,
        image: tutor.image
      }
    };
    topic.responses.push(responseDoc);
    await topic.save();
    return res.status(201).json(responseDoc);
  } catch (err) {
    console.error(err);  // log error for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

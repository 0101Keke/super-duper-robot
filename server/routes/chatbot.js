// server/routes/chatbot.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course'); // Make sure Course model exists!
const axios = require('axios');

const GEMINI_KEY = process.env.GEMINI_API_KEY || null;

// 🔍 Intent detection
function detectIntent(text) {
  const t = text.toLowerCase();
  if (t.includes('find tutor') || t.includes('tutor')) return 'find_tutor';
  if (t.includes('resource') || t.includes('materials') || t.includes('notes') || t.includes('video')) return 'resources';
  if (t.includes('book session') || t.includes('meeting') || t.includes('appointment')) return 'book_session';
  return 'general';
}

// 🧠 Main Chatbot Route
router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  const intent = detectIntent(message);

  try {
    // === 1️⃣ FIND TUTORS ===
    if (intent === 'find_tutor') {
      const tutors = await User.find({ role: 'tutor', isApproved: true })
        .select('fullName email phone bio')
        .limit(5);

      if (!tutors.length) {
        return res.json({
          type: 'tutors',
          reply: 'No approved tutors found at the moment.',
          data: []
        });
      }

      const reply = 'Here are some available tutors you can reach out to:';
      const data = tutors.map(t => ({
        name: t.fullName,
        email: t.email,
        phone: t.phone || 'N/A',
        bio: t.bio || 'Tutor profile not yet filled in.'
      }));

      return res.json({ type: 'tutors', intent, reply, data });
    }

    // === 2️⃣ FIND RESOURCES ===
    if (intent === 'resources') {
      const courses = await Course.find().select('title resources');
      if (!courses.length) {
        return res.json({
          type: 'resources',
          reply: 'No course resources available yet.',
          data: []
        });
      }

      const allResources = [];
      courses.forEach(c => {
        if (c.resources && c.resources.length > 0) {
          c.resources.forEach(r => {
            allResources.push({
              course: c.title,
              name: r.name,
              type: r.type,
              url: r.url
            });
          });
        }
      });

      const reply = 'Here are some learning resources available:';
      return res.json({ type: 'resources', intent, reply, data: allResources });
    }

    // === 3️⃣ BOOK SESSION ===
    if (intent === 'book_session') {
      return res.json({
        type: 'booking',
        reply: 'Booking feature coming soon! You can message a tutor directly to arrange a session.'
      });
    }

    // === 4️⃣ FALLBACK: AI / GENERIC ===
    if (GEMINI_KEY) {
      const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
      const body = { contents: [{ role: "user", parts: [{ text: message }] }] };
      const aiResp = await axios.post(endpoint, body, { headers: { 'Content-Type': 'application/json' } });
      const aiText = aiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.';

      return res.json({ type: 'text', intent: 'general', reply: aiText });
    }

    // Default fallback (no Gemini key)
    return res.json({
      type: 'text',
      intent: 'general',
      reply: `Hi! I can help you find tutors, view course resources, or book a session.`
    });

  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;

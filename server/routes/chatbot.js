const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const aiReply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I’m sorry, I couldn’t process that right now.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get a response from Gemini' });
  }
});

module.exports = router;

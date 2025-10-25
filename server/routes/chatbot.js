const express = require("express");
const router = express.Router();
const axios = require("axios");
const Tutor = require("../models/Tutor");
const Resource = require("../models/Resources");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const normalizedMsg = message.toLowerCase();

    // ✅ 1️⃣ Handle Tutor-related requests
    if (
      normalizedMsg.includes("find tutor") ||
      normalizedMsg.includes("tutor") ||
      normalizedMsg.includes("help") ||
      normalizedMsg.includes("subject")
    ) {
      const tutors = await Tutor.find({})
        .populate("userId", "name email")
        .lean();

      if (tutors.length > 0) {
        const structuredReply = {
          title: "Available Tutors 🎓",
          description: "Here are the tutors available in the system:",
          tutors: tutors.map((t) => ({
            name: t.userId?.name || "Unnamed Tutor",
            email: t.userId?.email || "N/A",
            bio: t.bio || "No bio available.",
            staffId: t.staffId || "N/A",
          })),
        };
        return res.json({ structured: true, type: "tutor", data: structuredReply });
      } else {
        return res.json({
          structured: true,
          type: "tutor",
          data: {
            title: "No Tutors Found",
            description: "There are currently no tutors available.",
            tutors: [],
          },
        });
      }
    }

    // ✅ 2️⃣ Handle Resource-related requests
    if (
      normalizedMsg.includes("resources") ||
      normalizedMsg.includes("study material") ||
      normalizedMsg.includes("notes") ||
      normalizedMsg.includes("course material") ||
      normalizedMsg.includes("view resources")
    ) {
      const resources = await Resource.find({})
        .populate("courseId", "name")
        .populate("tutorId", "userId")
        .lean();

      if (resources.length > 0) {
        const structuredReply = {
          title: "Available Course Resources 📚",
          description: "Here are the latest study materials uploaded by tutors:",
          resources: resources.map((r) => ({
            title: r.title,
            description: r.description || "No description",
            course: r.courseId?.name || "Unknown Course",
            tutor: r.tutorId?.userId || "Unknown Tutor",
            fileType: r.fileType || "file",
            fileUrl: r.fileUrl || r.link || "#",
          })),
        };
        return res.json({ structured: true, type: "resource", data: structuredReply });
      } else {
        return res.json({
          structured: true,
          type: "resources",
          data: {
            title: "No Resources Found",
            description: "No materials are currently available.",
            resources: [],
          },
        });
      }
    }

    // ✅ 3️⃣ Gemini fallback for general questions
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: message }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const aiReply =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t get a response from Gemini.";

    res.json({ structured: false, reply: aiReply });
  } catch (err) {
    console.error("❌ Chatbot route error:", err.message);
    res.status(500).json({
      error: "Failed to process chatbot request",
      details: err.message,
    });
  }
});

module.exports = router;

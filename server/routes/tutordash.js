import express from "express";
import Course from "../models/Course.js";
import Submission from "../models/Submission.js";
import Tutor from "../models/Tutor.js";
import Student from "../models/Student.js";

const router = express.Router();

// 🔹 Get total stats for a tutor
router.get("/:tutorId/stats", async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const totalCourses = await Course.countDocuments({ tutorId });
    const courses = await Course.find({ tutorId });
    const courseIds = courses.map(c => c._id);

    const totalStudents = await Student.countDocuments({ enrolledCourses: { $in: courseIds } });
    const pendingReviews = await Submission.countDocuments({ tutorId, status: "Pending" });

    res.json({ totalCourses, totalStudents, pendingReviews });
  } catch (err) {
    res.status(500).json({ error: "Failed to load tutor stats" });
  }
});

// 🔹 Get all tutor courses
router.get("/:tutorId/courses", async (req, res) => {
  try {
    const courses = await Course.find({ tutorId }).populate("students");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to load courses" });
  }
});

// 🔹 Get recent submissions
router.get("/:tutorId/submissions/recent", async (req, res) => {
  try {
    const submissions = await Submission.find({ tutorId })
      .sort({ date: -1 })
      .limit(5)
      .populate("studentId")
      .populate("courseId", "title");

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to load submissions" });
  }
});

export default router;

const express = require("express");
const router = express.Router();
const ResearchTopic = require("../models/topic");
const { checkUserRole, isAuthenticated } = require("../middleware/auth");
const checkTopicAvailability = require("../middleware/checktopicAvail");
const Topic = require("../models/Topic");
const Student = require("../models/Student");

const authenticateStudent = (req, res, next) => {
  if (req.user && req.user.role === "Student") {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Unauthorized" });
  }
};

//only for admin access to add research topic
router.post("/add-research-topic", checkUserRole("Admin"), async (req, res) => {
  try {
    const { title, department, availabilityStatus, description } = req.body;

    const newResearchTopic = new ResearchTopic({
      title,
      department,
      availabilityStatus,
      description,
    });

    const savedResearchTopic = await newResearchTopic.save();

    res.status(201).json({
      message: "Research topic added successfully",
      data: savedResearchTopic,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the research topic" });
  }
});

router.get(
  "/research-topics",
  isAuthenticated,
  authenticateStudent,
  async (req, res) => {
    try {
      const filter = {};

      if (req.query.department) {
        filter.department = req.query.department;
      }

      if (req.query.availabilityStatus) {
        filter.availabilityStatus = req.query.availabilityStatus;
      }

      const sort = {};

      if (req.query.sortByTitle === "asc") {
        sort.title = 1;
      }

      if (req.query.sortByTitle === "desc") {
        sort.title = -1;
      }

      const researchTopics = await ResearchTopic.find(filter).sort(sort).exec();

      res.json(researchTopics);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching research topics" });
    }
  }
);

router.get(
  "/research-topics/:id",
  isAuthenticated,
  authenticateStudent,
  async (req, res) => {
    try {
      const researchTopic = await ResearchTopic.findById(req.params.id);

      if (!researchTopic) {
        return res.status(404).json({ error: "Research topic not found" });
      }

      res.json(researchTopic);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the research topic" });
    }
  }
);

router.post("/select", checkTopicAvailability, async (req, res) => {
  try {
    const { topicId, studentId } = req.body;

    const selectedTopic = await Topic.findById(topicId);
    if (!selectedTopic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    if (!selectedTopic.isAvailable) {
      return res
        .status(400)
        .json({ message: "Topic is already selected by another student." });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const faculty = await Faculty.findById(student.facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    if (faculty.assignedStudentsCount >= 4) {
      return res
        .status(400)
        .json({
          message: "Faculty has reached the maximum assigned students limit.",
        });
    }

    student.selectedTopic = topicId;
    await student.save();

    selectedTopic.isAvailable = false;
    await selectedTopic.save();

    faculty.assignedStudentsCount += 1;
    await faculty.save();

    return res.json({ message: "Topic selected successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while selecting the topic." });
  }
});

module.exports = router;

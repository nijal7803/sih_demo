const express = require("express");
const router = express.Router();
const multer = require("multer");
const Proposal = require("../models/proposal");
const User = require("../models/user");
const { authenticateUser } = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/submit-proposal",
  authenticateUser,
  upload.single("proposalFile"),
  async (req, res) => {
    try {
      const studentId = req.user._id;

      const student = await User.findById(studentId);
      if (!student || student.role !== "Student") {
        return res.status(403).json({
          error: "Access denied: Only students can submit proposals.",
        });
      }

      const { proposalTitle, abstract, department } = req.body;

      const proposalFile = req.file;

      const proposal = new Proposal({
        proposalTitle,
        abstract,
        student: studentId,
        department,
      });

      if (proposalFile) {
        proposal.uploadedFiles.push({
          originalName: proposalFile.originalname,
          fileName: proposalFile.fieldname,
          fileData: proposalFile.buffer,
          fileType: proposalFile.mimetype,
        });
      }

      await proposal.save();

      res.status(201).json({ message: "Proposal submitted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to submit the proposal." });
    }
  }
);

router.put(
  "/proposals/:id/feedback",
  authenticateUser,
  checkUserRole(["Faculty"]),
  async (req, res) => {
    try {
      const proposalId = req.params.id;
      const feedback = req.body.feedback;

      const proposal = await Proposal.findById(proposalId);

      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found." });
      }

      if (proposal.approvalStatus !== "Rejected") {
        return res
          .status(400)
          .json({
            error: "Feedback can only be provided for rejected proposals.",
          });
      }

      proposal.feedback = feedback;
      await proposal.save();

      res.json({ message: "Feedback provided successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to provide feedback." });
    }
  }
);

// User (student) resubmits a proposal after making changes
router.put(
  "/proposals/:id/resubmit",
  authenticateUser,
  checkUserRole(["Student"]),
  async (req, res) => {
    try {
      const proposalId = req.params.id;

      const proposal = await Proposal.findById(proposalId);

      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found." });
      }

      if (proposal.approvalStatus !== "Rejected") {
        return res
          .status(400)
          .json({ error: "Only rejected proposals can be resubmitted." });
      }

      // Update proposal details based on the student's changes
      proposal.proposalTitle = req.body.proposalTitle || proposal.proposalTitle;
      proposal.abstract = req.body.abstract || proposal.abstract;
      

      // Clear previous feedback when resubmitting
      proposal.feedback = "";

     
      await proposal.save();

      res.json({ message: "Proposal resubmitted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to resubmit the proposal." });
    }
  }
);

module.exports = router;

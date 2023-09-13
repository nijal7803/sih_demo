const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  proposalTitle: { type: String, required: true },
  abstract: { type: String, required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  approvalDecision: {
    type: String,
    enum: ["Approved", "Rejected"],
  },
  uploadedFiles: [
    {
      originalName: String,
      fileName: String,
      fileData: Buffer,
      fileType: String,
    },
  ],
  feedback: String,
});

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;

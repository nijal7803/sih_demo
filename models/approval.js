const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  approvalDate: { type: Date, default: Date.now },
  feedback: String,
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true,
  },
});

const Approval = mongoose.model("Approval", approvalSchema);

module.exports = Approval;

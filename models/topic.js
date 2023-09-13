const mongoose = require("mongoose");

const researchTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  supervisor: {
    type: String,
  },
  availabilityStatus: {
    type: String,
    enum: ["Available", "Selected"],
    default: "Available",
  },
  isAvailable: {
    type: Boolean,
    default: true, 
  },
});

const ResearchTopic = mongoose.model("ResearchTopic", researchTopicSchema);

module.exports = ResearchTopic;

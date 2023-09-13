const Topic = require("../models/Topic");

module.exports = async function (req, res, next) {
  const { topicId } = req.body;

  const selectedTopic = await Topic.findById(topicId);
  if (!selectedTopic || selectedTopic.availabilityStatus==="Selected") {
    return res.status(400).json({ message: "Topic is not available." });
  }

  selectedTopic.availabilityStatus = "Selected";
  await selectedTopic.save();

  next();
};

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  role: { type: String, enum: ["Student", "Faculty", "Admin"], required: true },
  registrationDate: { type: Date, default: Date.now },
  department: String,
  enrollmentYear: Number,
  expectedGraduationDate: Date,
  supervisorId: { type: String },
  dissertationProposalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  selectedTopic: { type: String, required: true },
  assignedStudentsCount: {
    type: Number,
    default: 0,
    validate: {
      validator: function (count) {
        return count <= 4;
      },
      message: "A faculty member can have a maximum of 4 assigned students.",
    },
  },
  createdTimestamp: { type: Date, default: Date.now },
  updatedTimestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

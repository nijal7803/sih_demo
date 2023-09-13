const mongoose = require('mongoose');

const dissertationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  facultyFeedback: String, // Feedback provided by faculty
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  marks: Number,
  // You can add more fields as needed for your system
});

const Dissertation = mongoose.model('Dissertation', dissertationSchema);

module.exports = Dissertation;

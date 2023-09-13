const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;

// Define a storage location for uploaded PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Create a POST route to handle PDF uploads
app.post("/upload-pdf", upload.single("pdfFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const uploadedFilePath = req.file.path;
  const originalFileName = req.file.originalname;

  // You can perform further processing here, such as storing the file path in a database

  res.status(200).json({ message: "PDF file uploaded successfully." });
});

//  route to handle faculty review and feedback
app.put("/review-dissertation/:id", (req, res) => {
  const dissertationId = req.params.id;
  const { approvalStatus, facultyFeedback } = req.body;

  // Find the dissertation by ID and update its approval status and feedback
  Dissertation.findByIdAndUpdate(
    dissertationId,
    { approvalStatus, facultyFeedback },
    { new: true },
    (err, dissertation) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to review dissertation." });
      }

      if (!dissertation) {
        return res.status(404).json({ error: "Dissertation not found." });
      }

      res.status(200).json({ message: "Dissertation reviewed successfully." });
    }
  );
});

// route for students to resubmit their dissertation
app.put("/resubmit-dissertation/:id", (req, res) => {
  const dissertationId = req.params.id;

  // Find the dissertation by ID and update its approval status and feedback
  Dissertation.findByIdAndUpdate(
    dissertationId,
    { approvalStatus: "Pending", facultyFeedback: "" }, // Clear feedback and set to pending
    { new: true },
    (err, dissertation) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to resubmit dissertation." });
      }

      if (!dissertation) {
        return res.status(404).json({ error: "Dissertation not found." });
      }

      res
        .status(200)
        .json({ message: "Dissertation resubmitted successfully." });
    }
  );
});

router.post('/assign-marks/:dissertationId', async (req, res) => {
    try {
      const dissertationId = req.params.dissertationId;
      const { marks } = req.body;
  
      // Find the dissertation by ID
      const dissertation = await Dissertation.findById(dissertationId);
  
      if (!dissertation) {
        return res.status(404).json({ error: 'Dissertation not found.' });
      }
  
      // Update the marks field for the dissertation
      dissertation.marks = marks;
  
      // Save the updated dissertation
      await dissertation.save();
  
      return res.status(200).json({ message: 'Marks assigned successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to assign marks.' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

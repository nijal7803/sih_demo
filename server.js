const express = require("express");
const app = express();
const port = 8000;
const connectDB = require("./db/db");
const User = require("./models/user");
const cors = require("cors");
const bcrypt = require("bcrypt");

app.use(express.json());

app.use(cors());

app.post("/register/student", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      registrationDate,
      department,
      enrollmentYear,
      expectedGraduationDate,
      email,
      password,
      role, // Set role to "Student" for student registration
      // Add any additional student-specific fields here
    } = req.body;

    bcrypt.hash(password, 12).then(async (hashedPassword) => {
      try {
        const user = new User({
          firstName,
          lastName,
          email,
          dateOfBirth,
          registrationDate,
          department,
          enrollmentYear,
          expectedGraduationDate,
          password: hashedPassword,
          role: "Student", // Set the role to "Student"
          // Add any additional student-specific fields here
        });
        await user.save();
        res.status(201).json({ message: "Student registration successful" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Student registration failed" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Student registration failed" });
  }
});

app.post("/register/faculty", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      department,
      supervisorId,
      role, // Set role to "Faculty" for faculty registration
      // Add any additional faculty-specific fields here
    } = req.body;

    bcrypt.hash(password, 12).then(async (hashedPassword) => {
      try {
        const user = new User({
          firstName,
          lastName,
          email,
          department,
          supervisorId,
          password: hashedPassword,
          role: "Faculty", // Set the role to "Faculty"
          // Add any additional faculty-specific fields here
        });
        await user.save();
        res.status(201).json({ message: "Faculty registration successful" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Faculty registration failed" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Faculty registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }
    let portalUrl;
    if (user.role === "Student") {
      portalUrl = "/student-portal";
    } else if (user.role === "Faculty") {
      portalUrl = "/faculty-portal";
    }

    res.status(200).json({ message: "Login successful", portalUrl });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

connectDB();

app.listen(port, () => {
  console.log("Server is listening on Port 8000");
});

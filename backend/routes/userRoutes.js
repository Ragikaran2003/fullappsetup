const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const User = require("../models/User");
const moment = require("moment-timezone");
const router = express.Router();

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { studentId, password, pcId, project, homework,certificates } = req.body;

  try {
    console.log("Received request:", req.body);

    // Check if the username exists in the database
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(401).json({ message: "Username not found" });
    }

    console.log("Found student:", student);

    // Compare the provided password with hashed password in the database
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }


    // Check if a user session already exists
    const userExists = await User.findOne({ studentId: student.studentId, status: "active" });

    if (userExists) {
      return res.status(400).json({ message: "User already logged in" });
    }

    student.project = project;
    student.homework = homework;
    student.certificates = certificates;

    await student.save();

    // Create a new user session
    const newUser = new User({
      fullname: student.fullName,
      studentId: student.studentId,
      logintime: new Date(),
      pcId,
      status: "active",
      center: student.center,
      project,
      homework,
      certificates
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, studentId: newUser.studentId },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "5d" }
    );

    return res.status(200).json({
      token,
      message: "Login successful",
      user: {
        fullname: newUser.fullname,
        studentId: newUser.studentId,
      },
      
    });
    
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// LOGOUT ROUTE
router.post("/logout", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found or already logged out" });
    }

    user.logouttime = new Date();
    user.status = "inactive";
    await user.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(401).json({ message: "Invalid token or expired session" });
  }
});


router.post("/logout/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get user's ID from URL parameters
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.logouttime = new Date(); // Set current timestamp as logout time
    user.status = "inactive"; // Change status to inactive
    await user.save();

    return res.status(200).json({ message: "Logout successful", user });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/data/online', async (req, res) => {
  try {
    const { center } = req.query; // Extract the `center` parameter from query string
    const users = await User.find({ center }); // Query users by the specified `center`
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users by center:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;

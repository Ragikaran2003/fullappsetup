const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const moment = require("moment-timezone");
const Student = require('../models/Student');
const router = express.Router();

// Admin registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { email, password, googlesheet, Idmodel, center } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !googlesheet || !Idmodel || !center) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      googlesheet,
      Idmodel,
      center,
    });

    // Save the new admin to the database
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Query MongoDB for the given token
    const admin = await Admin.findById(token);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Send the center data back
    return res.status(200).json({
      email: admin.email,
      center: admin.center,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/centers/register", async (req, res) => {
    try {
        const admins = await Admin.find({}).sort({ _id: 1 });

        const centersSet = new Set();
        const IdmodelSet = new Set();
    
        admins.forEach(admin => {
          centersSet.add(admin.center);
          IdmodelSet.add(admin.Idmodel);
        });
    
        const centers = Array.from(centersSet);
        const Idmodel = Array.from(IdmodelSet);
      res.status(200).json({centers,Idmodel});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch centers" });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required" });
      }
  
      // Check if the email exists
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Compare provided password with the hashed password in DB
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Send success response
      res.status(200).json({
        message: "Login successful",
        id: admin._id,
        email: admin.email,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get('/data/studentsData', async (req, res) => {
    const { center } = req.query; // Extract adminCenter from query params
  
    if (!center) {
      return res.status(400).json({ error: 'Center is required' });
    }
  
    try {
      console.log('Received request for center:', center);
  
      const studentsData = await Student.find({ center }); // Query MongoDB
      const totalStudents = studentsData.length;
  
      res.status(200).json({
        totalStudents,
        studentsData,
      });
    } catch (error) {
      console.error('Error occurred while querying database:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message,
      });
    }
  });
  
module.exports = router;

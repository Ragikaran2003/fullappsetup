// Import necessary dependencies
const express = require("express");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const router = express.Router();

// POST - Student Registration
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      studentId,
      password,
      grade,
      gn,
      dob,
      gender,
      phoneNumber,
      parentNumber,
      address,
      center,
      project,
      homework,
      certificates,
      classes,
    } = req.body;
    function capitalizeFirstLetter(name) {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
    
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ error: "Student ID already exists" });
    }
    const fullName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      fullName,
      studentId,
      password: hashedPassword,
      grade,
      gn,
      dob,
      gender,
      phoneNumber,
      parentNumber,
      address,
      center,
      project: project || null,
      homework: homework || null,
      certificates: certificates || null,
      classes: classes || [],
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register Student" });
  }
});

// Route to update student classes
router.put('/update-classes/:id', async (req, res) => {
  const { id } = req.params;
  const { classes } = req.body;

  try {
    // Find the student by ID and update the classes field
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { classes }, // Update the classes field
      { new: true } // Return the updated student
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Check if the student exists
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (student.studentStatus === "dropout") {
      return res.status(403).json({ error: "You are currently marked as a dropout. Please contact the center for assistance." });
    }

    // Validate the provided password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Return the student's full name
    res.status(200).json({ 
      fullname: student.fullName, 
      id: student._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify student credentials" });
  }
});
router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({ _id: id });

    if (student) {
      return res.status(200).json({
        fullName: student.fullName,
        studentId: student.studentId,
        grade: student.grade,
        gn: student.gn,
        dob: student.dob,
        gender: student.gender,
        phoneNumber: student.phoneNumber,
        parentNumber: student.parentNumber,
        address: student.address,
        center: student.center,
        project: student.project,
        homework: student.homework,
        certificates: student.certificates,
        classes: student.classes,
      });
    } else {
      return res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    console.error("Error fetching student details:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});


router.get("/univercity", async (req, res) => {
  try {
    // Fetch students whose project is "University of Moratuwa"
    const students = await Student.find({ project: "University of Moratuwa" });

    // Remove duplicates by fullName and select only the necessary fields
    const uniqueStudents = Array.from(
      new Map(
        students.map((student) => [student.fullName, student])
      ).values()
    );

    // Prepare the response with only fullName, certificates, and center
    const filteredStudents = uniqueStudents.map((student) => ({
      fullName: student.fullName,
      certificates: student.certificates,
      center: student.center,
    }));

    // Send the response
    return res.status(200).json({ students: filteredStudents });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

const mongoose = require("mongoose");
require('dotenv').config();
const { getSriLankanTime } = require('../time');  // Import your custom time function

// Access the default timezone from .env

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  grade: { type: String, required: true },
  gn: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  parentNumber: { type: String, required: true },
  address: { type: String, required: true },
  center: { type: String, required: true },
  project: { type: String, default: null },
  homework: { type: String, default: null },
  certificates: { type: String, default: null },
  classes: { type: [String], default: [] },
  studentStatus: { type: String, default: "come" },
  
  // Use the getSriLankanTime function to set the createdAt field
  createdAt: { 
    type: Date, 
    default: () => {
      const sriLankanTime = getSriLankanTime();
      return new Date(sriLankanTime);  // Convert the time string to a Date object
    }
  },
});

module.exports = mongoose.model("Student", studentSchema);

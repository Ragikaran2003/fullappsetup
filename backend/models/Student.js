const mongoose = require("mongoose");
const moment = require("moment-timezone");
require('dotenv').config();

// Access the default timezone from .env
const timezone = process.env.DEFAULT_TIMEZONE || 'Asia/Colombo'; 

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
  createdAt: { type: Date, default: () => moment().tz(timezone).toDate() },
});
 
module.exports = mongoose.model("Student", studentSchema);

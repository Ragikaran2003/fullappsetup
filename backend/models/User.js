const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  studentId: { type: String, required: true },
  logintime: { type: Date, required: true },
  logouttime: { type: Date },
  pcId: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  center: { type: String },
  project: { type: String },
  homework: { type: String },
  certificates: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);

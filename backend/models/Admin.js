const mongoose = require("mongoose");

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googlesheet: { type: String, required: true },
  Idmodel: { type: String, required: true },
  center: { type: String, required: true },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;

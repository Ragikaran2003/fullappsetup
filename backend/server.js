require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment-timezone");
const nodemailer = require('nodemailer');

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes"); // Import the separated route
const userRoutes = require("./routes/userRoutes");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/v1/api/admin", adminRoutes);
app.use("/v1/api/students", studentRoutes); // Use student routes here
app.use("/v1/api/users", userRoutes);





// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ragikaran09@gmail.com', // Your email address
    pass: 'jqdq jnii dyzy tqtr',    // App password (use generated app-specific password)
  },
});

// Temporary store for OTPs
const otpStore = new Map();

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// ======================== ENDPOINTS =========================

// 1. **Send OTP Endpoint**
app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ error: 'Email is required.' });
  }

  const otp = generateOTP(); // Generate a random OTP

  otpStore.set(email, otp); // Save OTP for the provided email temporarily

  const mailOptions = {
    to: email,
    subject: 'OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>OTP Verification</h2>
        <p>Your OTP for verification is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      </div>
    `,
  };

  // Send the email with the OTP
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ error: 'Failed to send OTP. Please try again.' });
    }

    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).send({ message: 'OTP sent successfully!' });
  });
});

// 2. **Verify OTP Endpoint**
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send({ error: 'Email and OTP are required.' });
  }

  // Check if OTP exists and matches
  if (otpStore.has(email) && otpStore.get(email) == otp) {
    otpStore.delete(email); // Remove OTP after successful verification
    return res.status(200).send({ message: 'OTP verified successfully!' });
  }

  return res.status(400).send({ error: 'Invalid or expired OTP.' });
});


const sriLankanTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
console.log('Current Sri Lankan Time:', sriLankanTime);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

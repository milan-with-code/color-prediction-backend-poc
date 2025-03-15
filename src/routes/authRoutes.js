const express = require("express");
const {
  sendOtpHandler,
  verifyOtpHandler,
  loginHandler,
  registerUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOtpHandler); // Step 1: Send OTP
router.post("/verify-otp", verifyOtpHandler); // Step 2: Verify OTP & Set Password
router.post("/login", loginHandler); // Step 3: Login
router.post("/register", registerUser); // Step 4: Register User

module.exports = router;

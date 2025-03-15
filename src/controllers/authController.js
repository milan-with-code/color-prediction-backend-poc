const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Unique User ID
const generateUserId = () => {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${timestamp}${randomNumber}`;
};

// Send OTP
const sendOtpHandler = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber)
      return res.status(400).json({ message: "Phone number is required" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ phoneNumber, otp: otpCode });

    // Here you can integrate an SMS API (e.g., Twilio) to send the OTP
    console.log(`OTP for ${phoneNumber}: ${otpCode}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Verify OTP & Register User
const verifyOtpHandler = async (req, res) => {
  try {
    const { phoneNumber, otp, password, confirmPassword } = req.body;

    if (!phoneNumber || !otp || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const validOtp = await OTP.findOne({ phoneNumber, otp });
    if (!validOtp)
      return res.status(400).json({ message: "Invalid OTP or expired" });

    let user = await User.findOne({ phoneNumber });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId();

    if (!user) {
      user = new User({
        phoneNumber,
        password: hashedPassword,
        isVerified: true,
        userId,
      });
      await user.save();
    } else {
      user.password = hashedPassword;
      user.isVerified = true;
      await user.save();
    }

    await OTP.deleteMany({ phoneNumber });

    res.status(200).json({ message: "Account verified successfully", userId });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

// Login User
const loginHandler = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ message: "Login successful", token, userId: user.userId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 🔹 Register New User
const registerUser = async (req, res) => {
  try {
    const { phoneNumber, password, confirmPassword } = req.body;

    // 🛑 Validate input
    if (!phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 🔎 Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // 🔐 Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save user
    const newUser = new User({
      phoneNumber,
      password: hashedPassword,
      isVerified: true, // Set true if OTP verification is done
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  sendOtpHandler,
  verifyOtpHandler,
  loginHandler,
  registerUser,
};

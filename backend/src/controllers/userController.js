const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { admin } = require("../middlewares/authMiddleware");
const validator = require("validator"); // For email validation
const Email = require("../utils/Email");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, adminCode } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role =
      adminCode === process.env.ADMIN_CODE || email === process.env.ADMIN_EMAIL
        ? "admin"
        : "user";
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role,
    });

    await user.save();

    try {
      await Email.sendWelcomeEmail({ email, username });
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    console.log("Attempting login for:", email);

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
       
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
      date_joined: user.date_joined,
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Ensure at least one field is provided
    if (!username && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
        data: null,
      });
    }

    const updates = {};

    // Validate and check email uniqueness
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
          data: null,
        });
      }

      const emailExists = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
          data: null,
        });
      }

      updates.email = email;
    }

    // Check username uniqueness
    if (username) {
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: req.user.id },
      });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username is already in use",
          data: null,
        });
      }

      updates.username = username;
    }

    // Hash and update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Update the user
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true, // Ensures mongoose validators run
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Return updated user data
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        username: user.username,
        email: user.email,
        role: user.role,
        date_joined: user.date_joined,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };

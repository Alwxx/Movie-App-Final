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
    const { username, email, password, oldPassword } = req.body;

    // Ensure at least one field is provided
    if (!username && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
        data: null,
      });
    }

    const updates = {};
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Check old password if updating password
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password is required to change the password",
          data: null,
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
          data: null,
        });
      }

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Validate and check email uniqueness
    if (email) {
      // Remaining email validation code
    }

    // Check username uniqueness
    if (username) {
      // Remaining username validation code
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        date_joined: updatedUser.date_joined,
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

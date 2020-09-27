const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Imports
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../utilities/validation");
const verifyToken = require("../utilities/verifyToken");

// POST /api/users/register
// Create New User and Save in DB
router.post("/register", registerValidation, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    displayName: req.body.displayName,
    email: req.body.email,
    password: hashedPassword,
  });

  const errors = {};
  // displayName exists check
  const nameExists = await User.findOne({ displayName: req.body.displayName });
  if (nameExists) {
    errors.displayName = "Account with this name arleady exist.";
  }
  // Email exists check
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    errors.email = "Account assigned to this e-mail adress arleady exist.";
  }
  // Check for errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Successful login
    const savedUser = await newUser.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    const userData = {
      displayName: savedUser.displayName,
      email: savedUser.email,
    };
    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Somethink went wrong, please try again" });
  }
});

// POST /api/users/login
// Login user and get JWT token
router.post("/login", loginValidation, async (req, res) => {
  const errors = {};
  // Email exists check
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    errors.general = "Wrong e-mail or password";
    return res.status(400).json({ errors });
  }
  // Password check
  const passwordCompare = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordCompare) {
    errors.general = "Wrong e-mail or password";
    return res.status(400).json({ errors });
  }

  // Successful login
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  const userData = {
    displayName: user.displayName,
    email: user.email,
  };
  res.header("auth-token", token).json({ token, user: userData });
});

// GET /api/users/:id
// Get user data
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const userData = {
      displayName: user.displayName,
      email: user.email,
    };
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Somethink went wrong, please try again" });
  }
});

module.exports = router;

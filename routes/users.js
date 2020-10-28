const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Imports
const User = require("../models/user");
const {
  registerValidation,
  loginValidation,
  editProfileValidation,
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
      _id: savedUser._id,
      displayName: savedUser.displayName,
      email: savedUser.email,
    };
    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not register user. Please try again." });
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
  }

  if (!passwordCompare || !user) {
    errors.general = "Wrong e-mail or password";
    return res.status(400).json({ errors });
  }

  // Successful login
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  const userData = {
    _id: user._id,
    displayName: user.displayName,
    email: user.email,
  };
  res.header("auth-token", token).json({ token, user: userData });
});

// GET /api/users/:userId
// Get user data
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userData = {
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
    };
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not get a user. Please try again." });
  }
});

// PUT /api/users/:userId
// Edit user data
router.put("/:userId", verifyToken, editProfileValidation, async (req, res) => {
  const errors = {};

  // displayName exists check
  if (req.body.displayName) {
    const nameExists = await User.findOne({
      displayName: req.body.displayName,
    });
    if (nameExists) {
      errors.displayName = "Account with this name arleady exist.";
    }
  }

  // Email exists check
  if (req.body.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      errors.email = "Account assigned to this e-mail adress arleady exist.";
    }
  }

  // Check for errors
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const updatedUserData = {};

    // Check if values exists
    if (req.body.displayName) {
      updatedUserData.displayName = req.body.displayName;
    }
    if (req.body.email) {
      updatedUserData.email = req.body.email;
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updatedUserData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedUserData
    );

    // Edited user data
    const editedUserData = {
      ...updatedUser._doc,
      ...updatedUserData,
    };

    // Format edited user
    const formattedUserData = {
      _id: editedUserData._id,
      displayName: editedUserData.displayName,
      email: editedUserData.email,
    };

    return res.status(200).json(formattedUserData);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Could not edit your profile. Please try again." });
  }
});

module.exports = router;

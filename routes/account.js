const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

// Imports
const User = require("../models/user");
const passportConfig = require("../config/passportConfig");
const validateUser = require("../config/validateUser");
const { isNotAuth } = require("../config/authUser");

// Passport Init
passportConfig(
  passport,
  bcrypt,
  async (email) => {
    return await User.findOne({ email: email });
  },
  async (id) => {
    return await User.findById(id);
  }
);

// GET /account/login
// Login Page
router.get("/login", isNotAuth, (req, res) => {
  res.render("account/login");
});

// GET /account/register
// Register Page
router.get("/register", isNotAuth, (req, res) => {
  res.render("account/register");
});

// POST /account/login
// Login User
router.post("/login", isNotAuth, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/account/login",
    failureFlash: true,
  })(req, res, next);
});

// POST /account/register
// Create New User and Save in DB
router.post("/register", isNotAuth, validateUser, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    displayName: req.body.displayName,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    await user.save();
    req.flash(
      "success_message",
      "Thank you for creating account, you can now log in !"
    );
    res.redirect("/account/login");
  } catch {
    res.redirect("/account/register");
  }
});

// GET /account/logout
// Logout User
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_message", "You are now logged out !");
  res.redirect("/account/login");
});

module.exports = router;

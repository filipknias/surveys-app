const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

// Imports
const User = require("../models/user");
const passportConfig = require("../config/passportConfig");
const validateUser = require("../config/validateUser");
const { isNotAuth, isAuth } = require("../config/authUser");

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

// Login Page
router.get("/login", isNotAuth, (req, res) => {
  res.render("account/login", { user: req.user });
});

// Register Page
router.get("/register", isNotAuth, (req, res) => {
  res.render("account/register", { user: req.user });
});

// Welcome Page
router.get("/welcome", isNotAuth, (req, res) => {
  res.render("account/welcome", { user: req.user });
});

// Login User
router.post("/login", isNotAuth, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/account/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
});

// Create New User
router.post("/register", isNotAuth, validateUser, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    nickname: req.body.nickname,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.redirect("welcome");
  } catch {
    res.redirect("account/register");
  }
});

// Logout User
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("info_message", "You are now logged out!");
  res.redirect("/account/login");
});

module.exports = router;

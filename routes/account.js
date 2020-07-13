const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("account/login");
});

router.post("/login", (req, res) => {
  res.send("You are now logged in");
});

router.get("/register", (req, res) => {
  res.render("account/register");
});

router.post("/register", (req, res) => {
  res.send("Account created");
});

module.exports = router;

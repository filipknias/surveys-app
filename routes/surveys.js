const express = require("express");
const router = express.Router();

const { isAuth } = require("../config/authUser");

router.get("/search", (req, res) => {
  res.render("surveys/search", { user: req.user });
});

router.get("/create", isAuth, (req, res) => {
  res.render("surveys/create", { user: req.user });
});

module.exports = router;

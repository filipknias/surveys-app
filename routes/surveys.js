const express = require("express");
const router = express.Router();

router.get("/search", (req, res) => {
  res.render("surveys/search");
});

router.get("/create", (req, res) => {
  res.render("surveys/create");
});

module.exports = router;

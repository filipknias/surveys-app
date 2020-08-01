const express = require("express");
const router = express.Router();

// Imports
const Survey = require("../models/survey");

// GET /
// Home Page
router.get("/", async (req, res) => {
  const getTotalVotes = (question) => {
    return question.answers.reduce((total, currentValue) => {
      return total + currentValue.votes;
    }, 0);
  };
  try {
    // Get 10 latest surveys
    const latestSurveys = await Survey.find({ status: "public" })
      .sort({ createdAt: "desc" })
      .limit(10)
      .populate("author")
      .exec();
    // Get 10 most popular surveys
    const popularSurveys = await Survey.find({ status: "public" }).populate(
      "author"
    );
    popularSurveys.sort((a, b) => {
      return getTotalVotes(b) - getTotalVotes(a);
    });
    popularSurveys.length = 10;
    res.render("index", { surveys: [latestSurveys, popularSurveys] });
  } catch {
    res.redirect("/surveys/search");
  }
});

module.exports = router;

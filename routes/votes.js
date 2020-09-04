const express = require("express");
const router = express.Router();

// Imports
const Vote = require("../models/Vote");
const Survey = require("../models/Survey");

// POST /api/votes/:surveyId
// Send a vote to survey with given id
router.post("/:surveyId", async (req, res) => {
  const vote = new Vote({
    survey: req.params.surveyId,
    answers: req.body.answer,
  });
  try {
    const survey = await Survey.findById(req.params.surveyId);
    if (survey.status === "closed") {
      return res.status(400).json({ error: "This survey is closed." });
    }
    await survey.updateOne({
      $inc: { votesCount: 1 },
    });

    const savedVote = await vote.save();
    return res.status(200).json(savedVote);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Somethink went wrong, please try again" });
  }
});

// GET /api/votes/:surveyId
// Get all votes sended to survey with given id
router.get("/:surveyId", async (req, res) => {
  try {
    const votes = await Vote.find({ survey: req.params.surveyId });
    res.status(200).json(votes);
  } catch {
    console.error(err);
    res.status(500).json({ error: "Somethink went wrong, please try again" });
  }
});

module.exports = router;

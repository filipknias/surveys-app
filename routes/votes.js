const express = require("express");
const router = express.Router();

// Imports
const Vote = require("../models/Vote");
const Survey = require("../models/Survey");

// Middleware
const checkExpirationDate = require("../utilities/checkExpirationDate");

// POST /api/votes/:surveyId
// Send a vote to survey with given id
router.post("/:id", checkExpirationDate, async (req, res) => {
  const vote = new Vote({
    survey: req.params.id,
    answers: req.body.answers,
  });
  try {
    const survey = await Survey.findById(req.params.id);
    // Update votes count
    await survey.updateOne({
      $inc: { votesCount: req.body.answers.length },
    });

    const savedVote = await vote.save();
    return res.status(200).json(savedVote);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Could not send your vote. Please try again." });
  }
});

// GET /api/votes/:surveyId
// Get all votes sended to survey with given id
router.get("/:id", async (req, res) => {
  try {
    const votes = await Vote.find({ survey: req.params.id });
    res.status(200).json(votes);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Could not get the votes. Please try again." });
  }
});

module.exports = router;

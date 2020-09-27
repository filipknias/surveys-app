const express = require("express");
const router = express.Router();

// Imports
const Survey = require("../models/Survey");
const Vote = require("../models/Vote");
const verifyToken = require("../utilities/verifyToken");

// POST /api/surveys/create
// Create Survey and Save in DB
router.post("/create", verifyToken, async (req, res) => {
  // Create survey model
  const survey = new Survey({
    title: req.body.title,
    answers: req.body.answers,
    author: req.user,
    status: req.body.status,
    expirationDate: req.body.expirationDate,
  });

  // Set survey description if there is any
  if (req.body.description !== "") {
    survey.description = req.body.description;
  }

  // Try save survey in DB
  try {
    await survey.save();
    res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Somethink went wrong, please try again" });
  }
});

// GET /api/surveys/get
// Get all surveys by given queries
router.get("/get", async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  try {
    const survey = await Survey.find({ status: "public" })
      .sort({ [req.query.sort]: -1 })
      .limit(limit);
    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Somethink went wrong, please try again" });
  }
});

// GET /api/surveys/get/:id
// Get survey by id
router.get("/get/:id", async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    // Check expiration date of survey
    if (
      survey.expirationDate &&
      Date.now() > Date.parse(survey.expirationDate)
    ) {
      return res.status(400).json({ error: "Survey is closed." });
    }
    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Somethink went wrong, please try again" });
  }
});

// PUT /api/surveys/:id
// Edit survey with given id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Somethink went wrong, please try again" });
  }
});

// DELETE /api/surveys/:id
// Delete survey with given id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);
    const votes = await Vote.deleteMany({ survey: req.params.id });
    return res.status(200).json({ survey, votes });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Somethink went wrong, please try again" });
  }
});

module.exports = router;

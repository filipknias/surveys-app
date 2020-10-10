const express = require("express");
const router = express.Router();

// Imports
const Survey = require("../models/Survey");
const Vote = require("../models/Vote");

// Middleware
const checkExpirationDate = require("../utilities/checkExpirationDate");
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
    multipleAnswers: req.body.multipleAnswers,
  });

  // Set survey description if there is any
  if (req.body.description !== "") {
    survey.description = req.body.description;
  }

  // Set expiration date if there is any
  if (req.body.expirationDate) {
    survey.expirationDate = req.body.expirationDate;
  }

  // Try save survey in DB
  try {
    await survey.save();
    res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not save your survey. Please try again." });
  }
});

// GET /api/surveys/get
// Get all surveys by given queries
router.get("/get", async (req, res) => {
  let query = Survey.find({ status: 'public' });

    if (req.query.title && req.query.title !== "") {
      query = query.regex('title', new RegExp(req.query.title, 'i'));
    }

    if (req.query.sort) {
      query = query.sort({ [req.query.sort]: -1 });
    }

    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit));
    }
  try {
    const surveys = await query.exec();
    return res.status(200).json(surveys);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Could not load the resources. Please try again." });
  }
});

// GET /api/surveys/get/:id
// Get survey by id
router.get("/get/:id", checkExpirationDate, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    return res.status(200).json(survey);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Could not load the resources. Please try again." });
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
      .json({ error: "Could not save your survey. Please try again." });
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
      .json({ error: "Could not delete your survey. Please try again." });
  }
});

module.exports = router;

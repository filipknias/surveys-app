const express = require("express");
const router = express.Router();

// Imports
const Survey = require("../models/survey");
const { isAuth } = require("../config/authUser");

// GET /surveys/search
// Explore Surveys Page
router.get("/search", async (req, res) => {
  let surveys;
  if (req.query.title != null && req.query.title !== "") {
    surveys = await Survey.find({
      title: new RegExp(req.query.title, "i"),
      status: "public",
    }).populate("author");
  } else {
    surveys = [];
  }
  try {
    // const surveys = await Survey.find(searchOptions).populate("author");
    res.render("surveys/search", {
      surveys: surveys,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// GET /surveys/create
// Create Survey Page
router.get("/create", isAuth, (req, res) => {
  res.render("surveys/create");
});

// POST /surveys/create
// Create Survey and Save in DB
router.post("/create", isAuth, async (req, res) => {
  // Create survey model
  const survey = new Survey({
    title: req.body.title,
    answers: [],
    author: req.user,
    status: req.body.status,
  });

  // Set all answer objects
  req.body.answer.forEach((answer) => {
    if (answer !== "") {
      survey.answers.push({
        name: answer,
        votes: 0,
      });
    }
  });

  // Set survey description if there is any
  if (req.body.description !== "") {
    survey.description = req.body.description;
  }

  // Try save survey in DB
  try {
    await survey.save();
    res.redirect(`/surveys/${survey._id}/vote`);
  } catch (err) {
    res.redirect("/surveys/create");
  }
});

// GET /surveys/:id/vote
// Voting Survey Page
router.get("/:id/vote", async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).populate("author");
    res.render("surveys/vote", { survey: survey });
  } catch {
    res.redirect("/");
  }
});

// PUT /surveys/:id/vote
// Make a Vote and Save it in DB
router.put("/:id/vote", async (req, res) => {
  try {
    // Save vote in DB
    await Survey.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { "answers.$[answer].votes": 1 } },
      { arrayFilters: [{ "answer.name": req.body.answer }] }
    );
    // Redirect to survey results page
    res.redirect(`/surveys/${req.params.id}/results`);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// GET /surveys/:id/results
// Survey Results Page
router.get("/:id/results", async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).populate("author");
    // Sort results in descending order
    survey.answers = survey.answers.sort((a, b) => {
      return b.votes - a.votes;
    });
    res.render("surveys/results", { survey: survey });
  } catch {
    res.redirect("/");
  }
});

module.exports = router;

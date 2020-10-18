const Survey = require("../models/Survey");

// Middleware
// Check one survey based on surveyId param
exports.checkExpirationDate = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.surveyId);
    // Check expiration date
    if (
      survey.expirationDate &&
      Date.now() > Date.parse(survey.expirationDate)
    ) {
      // Change survey status to closed
      if (survey.status !== "closed") {
        await Survey.updateOne(
          { _id: req.params.id },
          { $set: { status: "closed" } }
        );
      }
      return res.status(400).json({ error: "This survey is closed." });
    } else {
      return next();
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Problem with processing a survey. Please try again." });
  }
};

exports.checkExpirationDateCollection = (surveys) => {
  try {
    surveys.forEach(async (survey) => {
      // Check expiration date
      if (
        survey.expirationDate &&
        Date.now() > Date.parse(survey.expirationDate)
      ) {
        // Change survey status to closed
        if (survey.status !== "closed") {
          await Survey.updateOne(
            { _id: survey._id },
            { $set: { status: "closed" } }
          );
        }
      }
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Problem with processing a survey. Please try again." });
  }
};

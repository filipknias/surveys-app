const Survey = require("../models/Survey");

module.exports = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id);
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

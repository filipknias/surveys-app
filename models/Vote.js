const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Survey",
  },
  answer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Vote", userSchema);

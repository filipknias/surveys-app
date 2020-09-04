const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Survey",
  },
  answers: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Vote", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Survey",
  },
  answers: {
    type: Array,
  },
});

module.exports = mongoose.model("Vote", userSchema);

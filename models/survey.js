const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  description: {
    type: String,
    required: false,
    minlength: 20,
    maxlength: 100,
  },
  answers: {
    type: Array,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "open",
    enum: ["open", "closed"],
  },
});

module.exports = mongoose.model("Survey", surveySchema);

const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 50,
  },
  answers: {
    type: Array,
    required: true,
  },
  votesCount: {
    type: Number,
    required: true,
    default: 0,
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
    enum: ["public", "private", "closed"],
  },
});

module.exports = mongoose.model("Survey", surveySchema);

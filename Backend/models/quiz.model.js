const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
});

const quizModel = mongoose.model("Quiz", quizSchema);

module.exports = quizModel;

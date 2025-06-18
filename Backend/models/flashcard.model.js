const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  question: String,
  answer: String,
});

const flashcardModel = mongoose.model("Flashcard", flashcardSchema);

module.exports = flashcardModel;

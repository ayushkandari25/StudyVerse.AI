const express = require("express");
const {
  generateFlashcards,
  getFlashcardsBySubject,
} = require("../controllers/flashcard.controller");

const flashCardRouter = express.Router();

flashCardRouter.post("/generate/:subjectId", generateFlashcards);
flashCardRouter.get("/:subjectId", getFlashcardsBySubject);

module.exports = flashCardRouter;

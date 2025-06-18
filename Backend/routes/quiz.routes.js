const express = require("express");
const { generateQuiz } = require("../controllers/quiz.controller");
const quizrouter = express.Router();

quizrouter.post("/generate/:subjectId", generateQuiz);

module.exports = quizrouter;

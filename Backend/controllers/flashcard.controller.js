const cohere = require("../configs/cohere");
const flashcardModel = require("../models/flashcard.model");
const subjectModel = require("../models/subject.model");

const generateFlashcards = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await subjectModel.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const syllabusText = subject.syllabus.join(", ");

    const response = await cohere.chat({
      model: "command-r", // ← use chat-capable model
      message: `Generate 5 flashcards with Q&A format based on this syllabus:\n${syllabusText}\n\nFormat:\nQ: ...\nA: ...`,
    });

    const text = response?.body?.text?.trim();
    if (!text) {
      return res.status(500).json({
        error: "No valid response from Cohere",
        cohereResponse: response.body,
      });
    }

    const flashcardPairs = text.split("\n\n").map((card) => {
      const [questionLine, answerLine] = card.split("\n");
      return {
        subjectId,
        question: questionLine?.replace("Q: ", "").trim(),
        answer: answerLine?.replace("A: ", "").trim(),
      };
    });

    const flashcards = await flashcardModel.insertMany(flashcardPairs);
    res.status(201).json(flashcards);
  } catch (err) {
    console.error("Error generating flashcards:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getFlashcardsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const flashcards = await flashcardModel.find({ subjectId });

    if (!flashcards || flashcards.length === 0) {
      return res
        .status(404)
        .json({ message: "No flashcards found for this subject" });
    }

    res.status(200).json(flashcards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateFlashcards, getFlashcardsBySubject };

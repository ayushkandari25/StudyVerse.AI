const generateWithGemini = require("../configs/gemini");
const Flashcard = require("../models/flashcard.model");

const generateFlashcards = async (req, res) => {
  const { subjectId } = req.params;
  const { userId, topic } = req.body;

  try {
    const prompt = `Generate 5 flashcards for the topic "${topic}" in the following format:
Q: ...
A: ...

Q: ...
A: ...
`;

    const content = await generateWithGemini(prompt);

    const flashcards = content
      .split(/Q:\s*/i)
      .slice(1)
      .map((item) => {
        const [q, a] = item.split(/A:\s*/i);
        return {
          userId,
          subjectId,
          question: q?.trim(),
          answer: a?.trim(),
        };
      })
      .filter((fc) => fc.question && fc.answer);

    await Flashcard.insertMany(flashcards);
    res.status(200).json({ flashcards });
  } catch (err) {
    console.error("Gemini Flashcard Error:", err);
    res.status(500).json({ message: "Failed to generate flashcards." });
  }
};

const getFlashcardsBySubject = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const flashcards = await Flashcard.find({ subjectId });
    res.status(200).json(flashcards);
  } catch (err) {
    res.status(500).json({ message: "Failed to get flashcards." });
  }
};

module.exports = {
  generateFlashcards,
  getFlashcardsBySubject,
};

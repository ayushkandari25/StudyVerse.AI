const genAI = require("../configs/cohere");
const quizModel = require("../models/quiz.model");
const subjectModel = require("../models/subject.model");

const generateQuiz = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await subjectModel.findById(subjectId);

    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

    const prompt = `Create 5 quiz questions with 4 options each and the correct answer for this syllabus:\n${subject.syllabus.join(
      ", "
    )}`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const questions = text.split("\n\n").map((q) => {
      const lines = q.split("\n");
      const question = lines[0]?.replace("Q: ", "").trim();
      const options = lines
        .slice(1, 5)
        .map((opt) => opt.replace(/^[A-D]: /, "").trim());
      const answerLine = lines.find((line) => line.includes("Answer:"));
      const answer = answerLine?.replace("Answer: ", "").trim();
      return { question, options, answer };
    });

    const quiz = await quizModel.create({ subjectId, questions });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateQuiz };

const subjectModel = require("../models/subject.model");
const studyPlanModel = require("../models/studyplan.model");
const openai = require("../configs/gemini");

const generateStudyPlan = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await subjectModel.findById(subjectId);

    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const prompt = `Create a 7-day study plan with daily tasks for the following syllabus topics:\n${subject.syllabus.join(
      ", "
    )}\nDeadline: ${subject.deadline.toDateString()}.\nFormat the output like:\n\nDay 1:\n- Task 1\n- Task 2\n\nDay 2:\n- Task 1\n...`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 600,
    });

    const text = response.choices[0].message.content;
    const planLines = text.split("\n").filter(Boolean);

    let currentDay = null;
    const tasksByDay = [];

    for (let line of planLines) {
      if (line.toLowerCase().startsWith("day")) {
        currentDay = { tasks: [] };
        tasksByDay.push(currentDay);
      } else if (currentDay) {
        currentDay.tasks.push(line.replace(/^-/, "").trim());
      }
    }

    const today = new Date();
    const dayDiff = Math.min(
      tasksByDay.length,
      Math.ceil((subject.deadline - today) / (1000 * 60 * 60 * 24))
    );

    const plans = tasksByDay.slice(0, dayDiff).map((day, i) => ({
      userId: subject.userId,
      subjectId: subject._id,
      date: new Date(today.getTime() + i * 24 * 60 * 60 * 1000),
      tasks: day.tasks,
      completed: false,
    }));

    const savedPlans = await studyPlanModel.insertMany(plans);

    res.status(201).json(savedPlans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateStudyPlan };

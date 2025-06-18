const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./configs/db");
const Userrouter = require("./routes/user.routes");
const Subjectrouter = require("./routes/subject.routes");
const flashCardRouter = require("./routes/flashcard.routes");
const studyPlanrouter = require("./routes/studyplan.routes");
const quizrouter = require("./routes/quiz.routes");
const sendDailyReminders = require("./cron/dailyReminder");

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", Userrouter);
app.use("/api/subjects", Subjectrouter);
app.use("/api/flashcards", flashCardRouter);
app.use("/api/study-plan", studyPlanrouter);
app.use("/api/quizzes", quizrouter);

sendDailyReminders();

app.get("/", (req, res) => {
  res.send("Welcome to StudyVerse.AI backend");
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const studyPlanModel = require("../models/studyplan.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendDailyReminders = () => {
  cron.schedule("0 8 * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await studyPlanModel
        .find({ date: today, completed: false })
        .populate("userId");

      for (let task of tasks) {
        const user = task.userId;

        if (!user.email) continue;

        const mailOptions = {
          from: `"StudyVerse.AI" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "📚 Daily Study Reminder",
          text: `Hello ${
            user.name
          },\n\nDon't forget to study today!\n\nYour tasks: ${task.tasks.join(
            ", "
          )}\n\nGood luck!\nStudyVerse.AI`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${user.email}`);
      }
    } catch (err) {
      console.error("Error sending reminders:", err.message);
    }
  });
};

module.exports = sendDailyReminders;

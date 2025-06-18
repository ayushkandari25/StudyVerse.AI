const mongoose = require("mongoose");

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  date: Date,
  tasks: [String],
  completed: {
    type: Boolean,
    default: false,
  },
});

const studyPlanModel = mongoose.model("StudyPlan", studyPlanSchema);

module.exports = studyPlanModel;

const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  syllabus: [String],
  deadline: Date,
});

const subjectModel = mongoose.model("Subject", subjectSchema);

module.exports = subjectModel;

const subjectModel = require("../models/subject.model");

const addSubject = async (req, res) => {
  try {
    const { userId, name, syllabus, deadline } = req.body;
    const subject = new subjectModel({ userId, name, syllabus, deadline });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = addSubject;

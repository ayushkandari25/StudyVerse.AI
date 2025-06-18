const express = require("express");
const addSubject = require("../controllers/subject.controller");
const Subjectrouter = express.Router();

Subjectrouter.post("/add", addSubject);

module.exports = Subjectrouter;

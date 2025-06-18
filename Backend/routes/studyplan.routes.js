const express = require("express");
const { generateStudyPlan } = require("../controllers/studyplan.controller");
const studyPlanrouter = express.Router();

studyPlanrouter.post("/generate/:subjectId", generateStudyPlan);

module.exports = studyPlanrouter;

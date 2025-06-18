const express = require("express");
const registerUser = require("../controllers/user.controller");
const Userrouter = express.Router();

Userrouter.post("/register", registerUser);

module.exports = Userrouter;

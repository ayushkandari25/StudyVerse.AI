const userModel = require("../models/user.model");

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new userModel({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = registerUser;

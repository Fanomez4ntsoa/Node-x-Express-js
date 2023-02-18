const User = require('../models/userModel');

const createUser = async(req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne(email);
  if(!findUser) {
    // For creation User
    const newUser = User.create(req.body);
    res.json(newUser);
  } else {
    // User Already exists
    res.json({
      msg: "User already exists",
      success: false
    });
  }
};

module.exports = { createUser };
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');

// For Authentification
const registerUserController = asyncHandler ( async (req, res) => {
  const email = req.body.email;
    const findUser = await User.findOne({ email : email });
    if(!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      throw new Error('This User is already exist');
    }
});

const loginUserController = asyncHandler( async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists 
  const findUser = await User.findOne({ email });
  if(findUser && await findUser.isPasswordMatched(password)) {
    res.json({
      _id      : findUser?._id,
      firstname: findUser?.firstname,
      lastname : findUser?.lastname,
      email    : findUser?.email,
      mobile   : findUser?.mobile,
      token    : generateToken(findUser?._id),
    });
  } else {
    throw new Error('Invalid Credentials');
  }
});

// CRUD for user
// Get All Users
const getAllUser = asyncHandler( async (req, res) => {
  try {
    const getUsers = await User.find()
    res.json(getUsers);
  } catch (error) {
    throw new Error(error)
  }
})
// Show information User
const getUser = asyncHandler( async (req, res) => {
  const { id } = req.params;
  try {
    const getUser = await User.findById(id);
    res.json(getUser);    
  } catch (error) {
    throw new Error(error);
  }
});
// Delete User
const deleteUser = asyncHandler( async(req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      status: deleteUser,
      message: "This user has been deleted"
    });
  } catch (error) {
    throw new Error(error);
  }
});
// Update information of User
const updateUser = asyncHandler( async(req, res) => {
  const { id } = req.user;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id, 
      {
        firstname: req?.body?.firstname,
        lastname : req?.body?.lastname,
        email    : req?.body?.email,
        mobile   : req?.body?.mobile,
      }, 
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler( async(req, res) => {
  const { id } = req.params;
  try {
    const block = await User.findByIdAndUpdate(id, { isBlocked: true}, {new: true});
    res.json({
      status: block?.isBlocked,
      message: 'User blocked'
    });
  } catch (error) {
    throw new Error(error);
  }
}); 
const unblockUser = asyncHandler( async(req, res) => {
  const { id } = req.params;
  try {
    const unblock = await User.findByIdAndUpdate(id, { isBlocked: false}, {new: true});
    res.json({
      status: unblock?.isBlocked,
      message: 'User unblocked'
    });
  } catch (error) {
    throw new Error(error);
  }
}); 

module.exports = { registerUserController, loginUserController, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser };
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const validateMongodbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');
const crypto = require('crypto');

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
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.is,
      { refreshToken: refreshToken },
      { new : true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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

//Logout 
const logout = asyncHandler ( async(req, res) => {
  const cookie = req.cookies;
  if(!cookie?.refreshToken)
    throw new Error('No Refresh Token in Cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ cookie });
  if(!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});


//handle refresh token
const handleRefreshToken = asyncHandler ( async(req, res) => {
  const cookie = req.cookies;
  if(!cookie?.refreshToken) 
    throw new Error('No Refresh Token in Cookies');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ cookie });
  if(!user)
    throw new Error("No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET,(err, decoded) => {
    if(err || user.id !== decoded.id) {
      throw new Error ('There is something wrong with refresh token');
    }
    const accessToken = generateToken(user?._id)
    res.json({ accessToken });
  });
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
  validateMongodbId(id);
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
  validateMongodbId(id);
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
  validateMongodbId(id);
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
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(id, { isBlocked: true}, {new: true});
    res.json({
      status: { isBlocked: block?.isBlocked },
      message: 'User blocked'
    });
  } catch (error) {
    throw new Error(error);
  }
}); 
const unblockUser = asyncHandler( async(req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
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

const updatePassword = asyncHandler ( async(req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongodbId(id);
  const user = await User.findById(id);
  if(password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler( async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if(!user)
    throw new Error('No user not found with this email');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = 'Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>'
    const data = {
      to: email,
      text: 'Hey',
      subject: "Forgot Password Link",
      html: resetURL,
    };
    sendEmail(data); 
    res.json(token)
  } catch (error) {
    throw new Error(error);
  }
})

const resetPassword = asyncHandler ( async (req,res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if(!user)
    throw new Error('Token Expired, Please try again later');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

module.exports = { registerUserController, loginUserController, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword };
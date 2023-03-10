const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModels');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const validateMongodbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');
const crypto = require("crypto");
const uniqid = require('uniqid');

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

const loginUserController = asyncHandler ( async (req, res) => {
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

// login for admin
const loginAdminController = asyncHandler( async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists 
  const findAdminUser = await User.findOne({ email });
  if(findAdminUser.role !== 'admin') {
    throw new Error('Not Authorised');
  }
  if(findAdminUser && await findAdminUser.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findAdminUser?.id);
    const updateuser = await User.findByIdAndUpdate(
      findAdminUser.is,
      { refreshToken: refreshToken },
      { new : true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id      : findAdminUser?._id,
      firstname: findAdminUser?.firstname,
      lastname : findAdminUser?.lastname,
      email    : findAdminUser?.email,
      mobile   : findAdminUser?.mobile,
      token    : generateToken(findAdminUser?._id),
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

// Get All Users
const getAllUsers = asyncHandler( async (req, res) => {
  try {
    const getUsers = await User.find()
    res.json(getUsers);
  } catch (error) {
    throw new Error(error)
  }
});

// Save address
const saveAddress = asyncHandler( async (req, res, next) => {
  const { id } = req.user;
  validateMongodbId(id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      id, 
      {
        address: req?.body?.address,
      }, 
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  } 
})


// CRUD for user
// Read information User
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
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
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

const getWishList = asyncHandler ( async (req,res) => {
  console.log(req.user);
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate('wishlist');
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler ( async (req, res) => {
  const { cart } = req.body;
  const { id } = req.user;
  validateMongodbId(id);
  try {
    let products = [];
    const user = await User.findById(id);
    // check if user already have product in cart
    const cartProduct = await Cart.findOne({ orderby: user.id });
    if(cartProduct) {
      cartProduct.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i].id).select('price').exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products, cartTotal, orderby: user?.id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler ( async (req,res) => {
  const { id } = req.user;
  validateMongodbId(id);
  try {
    const cart = await Cart.findOne({ orderby: id }).populate('products.product');
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler ( async ( req, res) => {
  const { id } = req.user;
  validateMongodbId(id);
  try {
    const user = await User.findOne({ id });
    const cart = await Cart.findOneAndRemove({ orderby: user.id });
    res.json(cart); 
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler ( async ( req,res) => {
  const { coupon } = req.body;
  const { id } = req.user;
  validateMongodbId(id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if(validCoupon === null) {
    throw new Error('Invalid Coupon');
  }
  const user = await User.findOne({ id });
  let { cartTotal } = await Cart.findOne({ orderby: user.id }).populate('products.product');
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
  await Cart.findOneAndUpdate({ orderby: user.id }, { totalAfterDiscount }, { new: true});
  res.json(totalAfterDiscount);
});

const createOrder = asyncHandler ( async (req, res) => {
  const { id } = req.user;
  const { COD, couponApplied } = req.body;
  validateMongodbId(id);
  try {
    if(!COD) {
      throw new Error('Create cash order failed');
    }
    const user = await User.findById(id);
    let userCart = await Cart.findOne({ orderby: user.id });
    let finalAmount = 0;
    if(couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: { id: uniqid(), method: 'COD', amount: finalAmount, status: 'Cash on Delivery', created: Date.now(), currency: 'usd' },
      orderby: user.id,
      orderStatus: 'Cash on Delivery',
    }).save();
    let update = userCart.products.map(( item) => {
      return {updateOne: { filter: { id : item.product.id }, update: { $inc: { quantity: -item.count, sold: +item.count}} }} 
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({
      message: "success",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler ( async(req, res) => {
  const { id } = req.user;
  validateMongodbId(id);
  try {
    const userOrders = await Order.findOne({ orderby: id }).populate('products.product').exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler ( async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(id, { orderStatus: status, paymentIntent: { status: status }}, { new: true });
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { registerUserController, loginUserController, loginAdminController, getAllUsers, getUser, getWishList, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus };
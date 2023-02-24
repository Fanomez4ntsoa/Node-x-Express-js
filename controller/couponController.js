const Coupon = require('../models/couponModels');
const validateMongodbId = require('../utils/validateMongodbid');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler( async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = { createCoupon };
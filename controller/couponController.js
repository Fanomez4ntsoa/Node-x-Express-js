const Coupon = require('../models/couponModels');
const validateMongodbId = require('../utils/validateMongodbid');
const asyncHandler = require('express-async-handler');

const getAllCoupons = asyncHandler ( async (req, res) => {
  try {
    const getAllCoupons = await Coupon.find();
    res.json(getAllCoupons);
  } catch (error) {
    throw new Error(error);
  }
});

// CRUD for coupon
// Create
const createCoupon = asyncHandler( async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
// Read information by Id
const updateCoupon = asyncHandler( async(req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error)
  }
})
// Delete coupon by Id
const deleteCoupon = asyncHandler ( async(req,res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json({
      status: deleteCoupon,
      message: 'This Coupon has been deleted'
    })
  } catch (error) {
    throw new Error(error)
  }
})
module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
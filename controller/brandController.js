const Brand = require('../models/brandModels');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbid');

// Get All categories
const getAllBrands = asyncHandler ( async (req,res) => {
  try {
    const getAllBrands = await Brand.find();
    res.json(getAllBrands)
  } catch (error) {
    throw new Error(error);
  }
});

//CRUD for category
// Create
const createBrand = asyncHandler ( async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});
// Read
const getBrand = asyncHandler ( async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getBrand = await Brand.findById(id);
    res.json(getBrand);
  } catch (error) {
    throw new Error(error);
  }
});
// Update
const updateBrand = asyncHandler ( async (req,res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updateBrand);
  } catch (error) {
    throw new Error(error);
  }
});
// Delete
const deleteBrand = asyncHandler ( async (req,res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json({
      status: deleteBrand,
      message: 'This category has been deleted'
    });
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = { getAllBrands, createBrand, getBrand, updateBrand, deleteBrand };
const Category = require('../models/categoryBlogModels');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbid');

// Get All categories
const getAllCategories = asyncHandler ( async (req,res) => {
  try {
    const getAllCategories = await Category.find();
    res.json(getAllCategories)
  } catch (error) {
    throw new Error(error);
  }
});

//CRUD for category
// Create
const createCategory = asyncHandler ( async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});
// Read
const getCategory = asyncHandler ( async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getCategory = await Category.findById(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});
// Update
const updateCategory = asyncHandler ( async (req,res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updateCategory);
  } catch (error) {
    throw new Error(error);
  }
});
// Delete
const deleteCategory = asyncHandler ( async (req,res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json({
      status: deleteCategory,
      message: 'This category has been deleted'
    });
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = { getAllCategories, createCategory, getCategory, updateCategory, deleteCategory };
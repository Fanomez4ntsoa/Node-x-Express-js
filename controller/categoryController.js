const Category = require('../models/categoryModels');
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
// Update
const updateCategory = asyncHandler ( async (req,res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCategory = await Category.findOneAndUpdate(id, req.body, { new: true });
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
    const deleteCategory = await Category.findOneAndDelete(id);
    res.json({
      status: deleteCategory,
      message: 'This category has been deleted'
    });
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
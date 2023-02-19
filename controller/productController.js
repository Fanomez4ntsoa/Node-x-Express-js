const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// Get All product
const getAllProduct = asyncHandler ( async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join('');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error)
  }
});

// CRUD for product
// Create
const createProduct = asyncHandler ( async (req, res) => {
  try {
    if(req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// Reade information product by Id
const getProduct = asyncHandler ( async(req, res) => {
  const { id } = req.params;
  try {
    const getProduct = await Product.findById(id);
    res.json(getProduct);
  } catch (error) {
    throw new Error(error)
  } 
});
// Update information of product
const updateProduct = asyncHandler ( async (req, res) => {
  const { id } = req.params;
  try {
    if(req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(
    id, req.body, { new: true }
    );
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
})
// Delete product
const deleteProduct = asyncHandler ( async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json({
      status: deleteProduct,
      message: "This product has been deleted"
    });
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = { createProduct, getAllProduct, getProduct, updateProduct, deleteProduct }
const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongodbId = require('../utils/validateMongodbid');

// Get All product
const getAllProducts = asyncHandler ( async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //limiting the fields
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page) {
      const productCount = await Product.countDocuments();
      if(skip >= productCount) {
        throw new Error('This Page does not exits');
      }
    };
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
// Read information product by Id
const getProduct = asyncHandler ( async(req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
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
  validateMongodbId(id);
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
  validateMongodbId(id);
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

const addToWishList = asyncHandler ( async (req,res) => {
  const { id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if(alreadyAdded) {
      let user = await User.findByIdAndUpdate(id, {
        $pull: {wishlist: prodId},
      }, { new: true });
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(id, {
        $push: {wishlist: prodId},
      }, { new: true });
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler ( async (req,res) => {
  const { id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === id.toString());
    if(alreadyRated) {
      const updateRating = await Product.updateOne({ ratings: { $elemMatch: alreadyRated }}, { $set: { "ratings.$.star": star, "ratings.$.comment": comment }}, { new: true} );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(prodId, { $push: { ratings: { star: star, comment: comment, postedby: id } } }, { new: true} );
    }
  const getAllRatings = await Product.findById(prodId);
  let totalRating = getAllRatings.ratings.length;
  let ratingsum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
  let actualRating = Math.round(ratingsum / totalRating);
  const finalRating = await Product.findByIdAndUpdate(prodId, { totalrating: actualRating }, { new: true} )
  res.json(finalRating);
  } catch (error) {
    throw new Error(error);
  }
});

const updateImages = asyncHandler ( async (req, res) => {
  console.log(req.files);
});

module.exports = { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, addToWishList, rating, updateImages}
const Blog = require('../models/blogModels');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbid');
const validateMongodbId = require('../utils/validateMongodbid');

const getAllPosts = asyncHandler ( async (req, res) => {
  try {
    const getAllPosts = await Blog.find();
    res.json(getAllPosts);
  } catch (error) {
    throw new Error(error);
  }
})
// CRUD for post
// Create
const createPost = asyncHandler ( async (req, res) => {
  try {
    const newPost = await Blog.create(req.body);
    res.json({
      status: 'success',
      newPost,
    });
  } catch (error) {
    throw new Error(error)
  }
})
// Read information by Id
const getPost = asyncHandler ( async (req,res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getPost = await Blog.findById(id).populate('likes').populate('dislikes');
    await Blog.findByIdAndUpdate(id, {$inc: { numViews : 1 } }, { new: true });
    res.json(getPost);
  } catch (error) {
    throw new Error(error);
  }
})
// Update Post
const updatePost = asyncHandler ( async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatePost = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatePost);
  } catch (error) {
    throw new Error(error);
  }
});
// Delete Post
const deletePost = asyncHandler ( async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletePost = await Blog.findOneAndDelete(id);
    res.json({
      status: deletePost,
      message: 'This Post has been deleted'
    });
  } catch (error) {
    throw new Error(error)
  }
});

const PostLiked = asyncHandler ( async (req, res) => {
  const { postId } = req.body;
   validateMongodbId(postId);
  const blog = await Blog.findById(postId);   // Find the blog which you want to be liked
  const loginUserId = req?.user?.id;    // find the user
  const isLiked = blog?.isLiked;    // find if the user has liked the post
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString());    // find if the user has disliked the blog
  if(alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(postId, {
      $pull: { dislikes: loginUserId },
      isDisliked: false,
    }, { new: true} );
    res.json(blog);
  }
  if(isLiked) {
    const blog = await Blog.findByIdAndUpdate(postId, {
      $pull: { likes: loginUserId },
      isLiked: false,
    }, { new: true} );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(postId, {
      $push: { likes: loginUserId },
      isLiked: true,
    }, { new: true} );
    res.json(blog);
  }
});

const PostDisliked = asyncHandler ( async (req, res) => {
  const { postId } = req.body;
   validateMongodbId(postId);
  const blog = await Blog.findById(postId);   // Find the blog which you want to be liked
  const loginUserId = req?.user?.id;    // find the user
  const isDisLiked = blog?.isDisliked;    // find if the user has liked the post
  const alreadyliked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString());    // find if the user has disliked the blog
  if(alreadyliked) {
    const blog = await Blog.findByIdAndUpdate(postId, {
      $pull: { likes: loginUserId },
      isLiked: false,
    }, { new: true} );
    res.json(blog);
  }
  if(isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(postId, {
      $pull: { dislikes: loginUserId },
      isDisliked: false,
    }, { new: true} );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(postId, {
      $push: { dislikes: loginUserId },
      isDisliked: true,
    }, { new: true} );
    res.json(blog);
  }
});

module.exports = { createPost, updatePost, getPost, getAllPosts, deletePost, PostLiked, PostDisliked };
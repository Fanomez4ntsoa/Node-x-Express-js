const express = require('express');
const { createPost, updatePost, getPost, getAllPosts, deletePost, PostLiked, PostDisliked } = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/new-post', authMiddleware, isAdmin, createPost);
router.put('/likes', authMiddleware, PostLiked);
router.put('/dislikes', authMiddleware, PostDisliked);
router.get('/:id', getPost)
router.get('/', getAllPosts)
router.put('/edit-post/:id', authMiddleware, isAdmin, updatePost);
router.delete('/:id', authMiddleware, isAdmin, deletePost);

module.exports = router;
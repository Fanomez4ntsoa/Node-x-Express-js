const express = require('express');
const { createPost, updatePost, getPost, getAllPosts, deletePost, PostLiked, PostDisliked, updateImages } = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { blogImgResize, uploadPhoto } = require('../middlewares/uploadImages');
const router = express.Router();

router.post('/new-post', authMiddleware, isAdmin, createPost);
router.put('/likes', authMiddleware, PostLiked);
router.put('/dislikes', authMiddleware, PostDisliked);
router.get('/:id', getPost)
router.get('/', getAllPosts)
router.put('/edit-post/:id', authMiddleware, isAdmin, updatePost);
router.put('/upload-image/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), blogImgResize, updateImages);
router.delete('/:id', authMiddleware, isAdmin, deletePost);

module.exports = router;
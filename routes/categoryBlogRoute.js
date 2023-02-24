const express = require('express');
const { createCategory, getAllCategories, updateCategory, deleteCategory, getCategory } = require('../controller/categoryBlogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/new-category-blog', authMiddleware, isAdmin, createCategory);
router.put('/edit-category-blog/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
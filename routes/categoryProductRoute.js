const express = require('express');
const { createCategory, getAllCategories, updateCategory, deleteCategory, getCategory } = require('../controller/categoryProductController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/new-category-product', authMiddleware, isAdmin, createCategory);
router.put('/edit-category-product/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
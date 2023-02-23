const express = require('express');
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controller/categoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllCategories);
router.put('/edit-category/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);
router.post('/new-category', authMiddleware, isAdmin, createCategory);

module.exports = router;
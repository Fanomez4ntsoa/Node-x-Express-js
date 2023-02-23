const express = require('express');
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controller/categoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllCategories);
router.post('/new-category', authMiddleware, isAdmin, createCategory);
router.put('/edit-category/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

module.exports = router;
const express = require('express');
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/new-product', authMiddleware, isAdmin, createProduct);
router.put('/edit-product/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
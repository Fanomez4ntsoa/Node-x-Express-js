const express = require('express');
const { createProduct, getAllProduct, getProduct, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();

router.get('/', getAllProduct);
router.post('/new-product', createProduct);
router.get('/:id', getProduct);
router.put('/edit-product/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router;
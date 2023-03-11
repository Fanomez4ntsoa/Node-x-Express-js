const express = require('express');
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, addToWishList, rating, updateImages } = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.put('/add-wishlist', authMiddleware, addToWishList);
router.put('/rating', authMiddleware, rating);
router.post('/new-product', authMiddleware, isAdmin, createProduct);
router.put('/edit-product/:id', authMiddleware, isAdmin, updateProduct);
router.put('/upload-image/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, updateImages);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;
const express = require('express');
const { createBrand, getAllBrands, updateBrand, deleteBrand, getBrand } = require('../controller/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllBrands);
router.get('/:id', getBrand);
router.post('/new-brand', authMiddleware, isAdmin, createBrand);
router.put('/edit-brand/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);

module.exports = router;
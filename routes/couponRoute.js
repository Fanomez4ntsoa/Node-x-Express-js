const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon } = require('../controller/couponController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/new-coupon', authMiddleware, isAdmin, createCoupon);
router.get('/', getAllCoupons)
router.put('/edit-coupon', authMiddleware, isAdmin, updateCoupon)

module.exports = router;
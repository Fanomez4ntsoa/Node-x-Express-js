const express = require('express');
const { createCoupon } = require('../controller/couponController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/new-coupon', authMiddleware, isAdmin, createCoupon);

module.exports = router;
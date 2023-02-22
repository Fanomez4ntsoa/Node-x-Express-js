const express = require('express');
const { registerUserController, loginUserController, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/all-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword)
router.put("/change-password", authMiddleware, updatePassword);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/edit-user",authMiddleware, updateUser);
router.put("/block-user/:id",authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware, isAdmin, unblockUser);
router.delete("/:id", deleteUser);

module.exports = router;

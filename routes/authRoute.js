const express = require('express');
const { registerUserController, loginUserController, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/all-users", getAllUser);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", deleteUser);
router.put("/edit-user",authMiddleware, updateUser);
router.put("/block-user/:id",authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware, isAdmin, unblockUser);

module.exports = router;

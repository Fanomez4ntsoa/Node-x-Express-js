const express = require('express');
const { registerUserController, loginUserController, getAllUser, getUser, deleteUser, updateUser } = require('../controller/userController');
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/all-users", getAllUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
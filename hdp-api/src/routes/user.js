const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserController = require("../controllers/userController");

router.get("/profile", auth, UserController.getProfile);
router.put("/profile", auth, UserController.updateProfile);

module.exports = router;

const express = require("express");
const { register, login, logout, getMe } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);

module.exports = router;
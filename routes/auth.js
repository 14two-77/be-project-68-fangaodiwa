const express = require("express");
const { register, login, logout } = require("./../controllers/auth.js");
const { protect } = require('./../middleware/auth.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);

module.exports = router;
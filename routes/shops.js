const express = require("express");
const { getShops } = require("./../controllers/shops.js");
const { protect } = require('./../middleware/auth.js');

const router = express.Router();

router.route('/')
    .get(protect, getShops);

module.exports = router;
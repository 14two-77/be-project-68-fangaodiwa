const express = require("express");
const { getShops, getShop, createShop, updateShop, deleteShop } = require("./../controllers/shops.js");
const { protect, authorize } = require('./../middleware/auth.js');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getShops)
  .post(authorize('admin'), createShop);

router.route('/:id')
  .get(getShop)
  .put(authorize('admin'), updateShop)
  .delete(authorize('admin'), deleteShop);


module.exports = router;
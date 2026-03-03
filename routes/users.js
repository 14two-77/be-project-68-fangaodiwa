const express = require('express');
const { updateUserTier } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/:id/tier')
  .put(authorize('admin'), updateUserTier);

module.exports = router;

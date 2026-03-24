const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, updateUserTier } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router.route('/:id/tier')
  .put(authorize('admin'), updateUserTier);

module.exports = router;

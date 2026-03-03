const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/services');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getServices)
  .post(authorize('admin'), createService);

router.route('/:id')
  .get(getService)
  .put(authorize('admin'), updateService)
  .delete(authorize('admin'), deleteService);

module.exports = router;

const mongoose = require('mongoose');
const Service = require('../models/Service');
const Shop = require('../models/Shop');

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Private
exports.getServices = async (req, res) => {
  try {
    const filter = req.query.shop ? { shop: req.query.shop } : {};

    if (req.query.shop) {
      const shop = await Shop.findById(req.query.shop);
      if (!shop) {
        return res.status(404).json({ success: false, message: `No shop with id ${req.query.shop}` });
      }
    }

    const services = await Service.find(filter).populate({
      path: 'shop',
      select: 'name address phone open_time close_time'
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Cannot get services' });
  }
};

// @desc    Get single service
// @route   GET /api/v1/services/:id
// @access  Private
exports.getService = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: `Invalid id format: ${req.params.id}` });
    }

    const service = await Service.findById(req.params.id).populate({
      path: 'shop',
      select: 'name address phone open_time close_time'
    });

    if (!service) {
      return res.status(404).json({ success: false, message: `No service with id ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Cannot get service' });
  }
};

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private
exports.createService = async (req, res) => {
  try {
    const shopId = req.body.shop;

    if (!shopId) {
      return res.status(400).json({ success: false, message: 'Please provide a shop id in the request body' });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: `No shop with id ${shopId}` });
    }

    const service = await Service.create(req.body);

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Cannot create service' });
  }
};

// @desc    Update single service
// @route   PUT /api/v1/services/:id
// @access  Private
exports.updateService = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: `Invalid id format: ${req.params.id}` });
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return res.status(404).json({ success: false, message: `No service with id ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Cannot update service' });
  }
};

// @desc    Delete single service
// @route   DELETE /api/v1/services/:id
// @access  Private
exports.deleteService = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: `Invalid id format: ${req.params.id}` });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: `No service with id ${req.params.id}` });
    }

    await service.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Cannot delete service' });
  }
};

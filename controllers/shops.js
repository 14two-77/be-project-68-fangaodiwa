const Shop = require("./../models/Shop.js");
const Service = require("./../models/Service.js");
const Reservation = require("./../models/Reservation.js");

// @desc Get all shops
// @route GET /api/v1/shops
// @access Private
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('services');

    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (err) {
    console.log(err.stack);

    res.status(400).json({
      success: false
    });
  }
}

// @desc Get single shop
// @route GET /api/v1/shops/:id
// @access Private
exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('services');

    if (!shop) return res.status(404).json({
      success: false
    });

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (err) {
    console.log(err.stack);

    res.status(400).json({
      success: false
    });
  }
}

// @desc Create new shop
// @route POST /api/v1/shops
// @access Private
exports.createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);

    res.status(201).json({
      success: true,
      data: shop
    });
  } catch (err) {
    console.log(err.stack);

    res.status(400).json({
      success: false
    });
  }
}

// @desc Update single shop
// @route PUT /api/v1/shops/:id
// @access Private
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: true,
      runValidators: true
    });

    if (!shop) return res.status(400).json({
      success: false
    });

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (err) {
    console.log(err.stack);

    res.status(400).json({
      success: false
    });
  }
}

// @desc Delete single shop
// @route DELETE /api/v1/shops/:id
// @access Private
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) return res.status(404).json({
      success: false
    });


    const services = await Service.find({ shop: req.params.id });
    const serviceIds = services.map(s => s._id);

    if (serviceIds.length > 0) {
      await Reservation.deleteMany({ service: { $in: serviceIds } });
    }

    await Service.deleteMany({ shop: req.params.id });

    await shop.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.log(err.stack);

    res.status(400).json({
      success: false
    });
  }
}

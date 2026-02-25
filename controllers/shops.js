const Shop = require("./../models/Shop.js");

// @desc Get all shops
// @route GET /api/v1/shops
// @access Private
exports.getShops = async (req, res, next) => {
    try {
        const shops = await Shop.find().select("-_id -__v -createdAt");

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
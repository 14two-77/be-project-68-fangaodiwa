const User = require("./../models/User.js");
const { sendTokenResponse } = require('./../utils/utils.js');

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, phone, password, role, tier } = req.body;

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role,
            tier
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.log(err.stack);

        res.status(400).json({
            success: false
        });
    }
}

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({
            success: false
        });

        const user = await User.findOne({ email }).select('+password');
        
        if (!user) return res.status(400).json({
            success: false,
            msg: 'Invalid credentials'
        });

        const isMatch = await user.matchPassword(password);

        if (!isMatch) return res.status(400).json({
            success: false,
            msg: 'Invalid credentials'
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: 'Cannot convert email or password to string'
        });
    }
}

// @desc Log user out / clear cookie
// @route GET /api/v1/auth/logout
// @access Private
exports.logout = (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + (10 * 1000)),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
}
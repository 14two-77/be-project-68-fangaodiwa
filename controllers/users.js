const User = require('../models/User');

// @desc    Update user tier
// @route   PUT /api/v1/users/:id/tier
// @access  Private
exports.updateUserTier = async (req, res) => {
  try {
    const { tier } = req.body;

    if (!tier) {
      return res.status(400).json({ success: false, message: 'Please provide a tier value' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { tier },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: `No user with id ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

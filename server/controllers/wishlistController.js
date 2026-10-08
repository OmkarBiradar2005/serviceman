import User from '../models/User.js';
import Service from '../models/Service.js';

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: {
        path: 'providerId',
        select: 'name email phone'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Add service to wishlist
 * @route   POST /api/wishlist/:serviceId
 * @access  Private
 */
export const addToWishlist = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Get user and check if already in wishlist
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.wishlist.includes(serviceId)) {
      return res.status(400).json({
        success: false,
        message: 'Service already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(serviceId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Service added to wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Remove service from wishlist
 * @route   DELETE /api/wishlist/:serviceId
 * @access  Private
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== serviceId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Service removed from wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Check if service is in wishlist
 * @route   GET /api/wishlist/check/:serviceId
 * @access  Private
 */
export const checkWishlist = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isInWishlist = user.wishlist.includes(serviceId);

    res.status(200).json({
      success: true,
      data: { isInWishlist }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

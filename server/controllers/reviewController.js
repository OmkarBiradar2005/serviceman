import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

/**
 * @desc    Create a review
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId).populate('serviceId', 'title');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the customer of this booking
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this booking'
      });
    }

    // Create review
    const review = await Review.create({
      serviceId: booking.serviceId,
      bookingId,
      customerId: req.user.id,
      providerId: booking.providerId,
      rating,
      comment
    });

    // Update service rating
    await updateServiceRating(booking.serviceId);

    await review.populate('customerId', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get reviews for a service
 * @route   GET /api/reviews/service/:serviceId
 * @access  Public
 */
export const getServiceReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({
      serviceId: req.params.serviceId,
      isApproved: true
    })
      .populate('customerId', 'name profileImage')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({
      serviceId: req.params.serviceId,
      isApproved: true
    });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get service reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/reviews/admin/all
 * @access  Private (Admin)
 */
export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find()
      .populate('serviceId', 'title')
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments();

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Delete review (Admin)
 * @route   DELETE /api/reviews/:id
 * @access  Private (Admin)
 */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const serviceId = review.serviceId;

    await Review.findByIdAndDelete(req.params.id);

    // Update service rating after deletion
    await updateServiceRating(serviceId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Toggle review approval (Admin)
 * @route   PUT /api/reviews/:id/approve
 * @access  Private (Admin)
 */
export const toggleReviewApproval = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review ${review.isApproved ? 'approved' : 'unapproved'} successfully`,
      data: review
    });
  } catch (error) {
    console.error('Toggle review approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Helper function to update service rating
 */
const updateServiceRating = async (serviceId) => {
  try {
    const reviews = await Review.find({ serviceId, isApproved: true });

    if (reviews.length === 0) {
      await Service.findByIdAndUpdate(serviceId, {
        rating: 0,
        totalReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await Service.findByIdAndUpdate(serviceId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Update service rating error:', error);
  }
};

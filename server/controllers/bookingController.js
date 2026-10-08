import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private (Customer)
 */
export const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      bookingDate,
      bookingTime,
      customerAddress,
      customerPhone,
      notes
    } = req.body;

    // Get service details
    const service = await Service.findById(serviceId).populate('providerId', 'name');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.availability) {
      return res.status(400).json({
        success: false,
        message: 'Service is not available'
      });
    }

    // Create booking
    const booking = await Booking.create({
      serviceId,
      customerId: req.user.id,
      providerId: service.providerId._id,
      bookingDate,
      bookingTime,
      totalAmount: service.price,
      customerAddress,
      customerPhone,
      notes
    });

    // Populate service and provider details
    await booking.populate('serviceId', 'title category price duration');
    await booking.populate('providerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/bookings/admin/all
 * @access  Private (Admin)
 */
export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title category')
      .populate('customerId', 'name email phone')
      .populate('providerId', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get customer's bookings
 * @route   GET /api/bookings/customer/my-bookings
 * @access  Private (Customer)
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('serviceId', 'title category price images')
      .populate('providerId', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get provider's bookings
 * @route   GET /api/bookings/provider/assigned
 * @access  Private (Provider)
 */
export const getProviderBookings = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { providerId: req.user.id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('serviceId', 'title category price')
      .populate('customerId', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId')
      .populate('customerId', 'name email phone address')
      .populate('providerId', 'name email phone address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (
      booking.customerId._id.toString() !== req.user.id &&
      booking.providerId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Update booking status (Provider)
 * @route   PUT /api/bookings/:id/status
 * @access  Private (Provider)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id).populate('serviceId', 'title');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the provider
    if (booking.providerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    const oldStatus = booking.status;
    booking.status = status;

    // Track start time when status changes to in-progress
    if (status === 'in-progress' && oldStatus !== 'in-progress') {
      booking.startedAt = new Date();
    }

    // Calculate duration and set completion time when completed
    if (status === 'completed') {
      booking.completedAt = new Date();
      if (booking.startedAt) {
        // Calculate duration in minutes
        const durationMs = booking.completedAt - booking.startedAt;
        booking.duration = Math.round(durationMs / 1000 / 60); // Convert to minutes
      }
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

/**
 * @desc    Cancel booking (Customer)
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private (Customer)
 */
export const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the customer
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (
      booking.status === 'completed' ||
      booking.status === 'cancelled'
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

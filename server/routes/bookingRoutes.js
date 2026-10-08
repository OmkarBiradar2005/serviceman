import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('customer'), createBooking);
router.get('/customer/my-bookings', protect, authorize('customer'), getMyBookings);
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);

// Provider routes
router.get('/provider/assigned', protect, authorize('provider'), getProviderBookings);
router.put('/:id/status', protect, authorize('provider'), updateBookingStatus);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllBookings);

// Shared routes
router.get('/:id', protect, getBookingById);

export default router;

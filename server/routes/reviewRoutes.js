import express from 'express';
import {
  createReview,
  getServiceReviews,
  getAllReviews,
  deleteReview,
  toggleReviewApproval
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/service/:serviceId', getServiceReviews);

// Customer routes
router.post('/', protect, authorize('customer'), createReview);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllReviews);
router.delete('/:id', protect, authorize('admin'), deleteReview);
router.put('/:id/approve', protect, authorize('admin'), toggleReviewApproval);

export default router;

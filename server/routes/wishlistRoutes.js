import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user's wishlist
router.get('/', getWishlist);

// Check if service is in wishlist
router.get('/check/:serviceId', checkWishlist);

// Add service to wishlist
router.post('/:serviceId', addToWishlist);

// Remove service from wishlist
router.delete('/:serviceId', removeFromWishlist);

export default router;

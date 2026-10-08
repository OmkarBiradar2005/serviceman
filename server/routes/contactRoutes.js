import express from 'express';
const router = express.Router();
import {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// Public route - anyone can submit contact form
router.post('/', createContact);

// Admin routes - requires authentication and admin role
router.get('/', protect, authorize('admin'), getAllContacts);
router.put('/:id/status', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContact);

export default router;

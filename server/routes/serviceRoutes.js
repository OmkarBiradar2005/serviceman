import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getMyServices
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Provider routes
router.post('/', protect, authorize('provider', 'admin'), createService);
router.get('/provider/my-services', protect, authorize('provider'), getMyServices);
router.put('/:id', protect, authorize('provider', 'admin'), updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteService);

export default router;

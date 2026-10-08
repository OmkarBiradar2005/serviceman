import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin authorization
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/stats', getDashboardStats);

export default router;

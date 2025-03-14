import express from 'express';
import {
  addSubscriber,
  unsubscribe,
  verifyEmail,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
  upgradeSubscription
} from '../controllers/subscriber.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/', addSubscriber);
router.get('/unsubscribe', unsubscribe);
router.get('/verify/:token', verifyEmail);

// Admin routes
router.get('/', adminMiddleware, getAllSubscribers);
router.get('/:id', adminMiddleware, getSubscriberById);
router.put('/:id', adminMiddleware, updateSubscriber);
router.delete('/:id', adminMiddleware, deleteSubscriber);
router.put('/:id/upgrade', adminMiddleware, upgradeSubscription);

export default router; 
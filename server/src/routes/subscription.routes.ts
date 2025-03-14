import express from 'express';
import subscriptionController from '../controllers/subscription.controller';

const router = express.Router();

// Create a free subscription
router.post('/free', subscriptionController.createFreeSubscription);

// Create a checkout session for a paid subscription
router.post('/checkout', subscriptionController.createCheckoutSession);

// Cancel a subscription
router.post('/cancel', subscriptionController.cancelSubscription);

// Update communication preferences
router.post('/preferences', subscriptionController.updatePreferences);

export default router; 
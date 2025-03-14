import express from 'express';
import adminController from '../controllers/admin.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authMiddleware.authenticateAdmin);

// Subscriber management routes
router.get('/subscribers', adminController.getAllSubscribers);
router.get('/subscribers/:id', adminController.getSubscriberById);
router.put('/subscribers/:id', adminController.updateSubscriber);
router.delete('/subscribers/:id', adminController.deleteSubscriber);
router.post('/subscribers/bulk-action', adminController.bulkActionSubscribers);
router.get('/subscribers/export', adminController.exportSubscribers);

// Content management routes
router.get('/content', adminController.getAllContent);
router.get('/content/:id', adminController.getContentById);
router.post('/content/test-send', adminController.testSendContent);
router.post('/content/distribute/:id', adminController.distributeContent);
router.post('/content/schedule', adminController.scheduleContentDistribution);
router.delete('/content/schedule/:id', adminController.cancelScheduledDistribution);

// Analytics routes
router.get('/analytics/dashboard', adminController.getDashboardMetrics);
router.get('/analytics/conversion', adminController.getConversionMetrics);
router.get('/analytics/content-performance', adminController.getContentPerformanceMetrics);
router.get('/analytics/export', adminController.exportAnalytics);
router.get('/analytics/weekly-report', adminController.generateWeeklyReport);

// Stripe integration routes
router.get('/stripe/subscriptions', adminController.getStripeSubscriptions);
router.put('/stripe/subscriptions/:id', adminController.updateStripeSubscription);
router.delete('/stripe/subscriptions/:id', adminController.cancelStripeSubscription);
router.post('/stripe/refunds', adminController.issueStripeRefund);
router.get('/stripe/revenue', adminController.getRevenueMetrics);

// Testing environment routes
router.get('/testing/subscribers', adminController.getTestSubscribers);
router.post('/testing/environment/reset', adminController.resetTestEnvironment);
router.post('/testing/content/simulate', adminController.simulateContentDelivery);

export default router; 
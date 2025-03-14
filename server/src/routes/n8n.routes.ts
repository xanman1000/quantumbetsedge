import express from 'express';
import n8nController from '../controllers/n8n.controller';

const router = express.Router();

// Apply webhook validation middleware to webhook endpoints
router.use('/webhook', n8nController.validateWebhook);

// Webhook for receiving newsletter content from n8n
router.post('/webhook/content', n8nController.receiveNewsletterContent);

// Trigger newsletter distribution
router.post('/trigger-distribution', n8nController.triggerNewsletterDistribution);

// Send test newsletter to a specific email
router.post('/send-test', n8nController.sendTestNewsletter);

// Check the status of a workflow execution
router.get('/status/:executionId', n8nController.checkWorkflowStatus);

export default router; 
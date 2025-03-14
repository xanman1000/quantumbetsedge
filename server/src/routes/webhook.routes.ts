import express, { Request, Response } from 'express';
import { processAndStoreContent } from '../controllers/content.controller';

const router = express.Router();

// Webhook route for receiving content from n8n
router.post('/content', processAndStoreContent);

// Placeholder for future webhook endpoints
router.post('/delivery-status', (req: Request, res: Response) => {
  // Validate webhook secret
  const webhookSecret = req.headers['x-webhook-secret'];
  
  if (!webhookSecret || webhookSecret !== process.env.N8N_WEBHOOK_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized webhook request'
    });
  }
  
  // Process delivery status update
  // This will be implemented in the future
  res.status(200).json({
    success: true,
    message: 'Delivery status update received'
  });
});

export default router; 
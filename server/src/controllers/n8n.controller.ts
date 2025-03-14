import { Request, Response } from 'express';
import { n8nService } from '../services/n8n.service';
import dotenv from 'dotenv';

dotenv.config();

// API Key for n8n webhook authentication
const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'default-webhook-secret-change-me';

/**
 * Middleware to validate n8n webhook requests
 */
export const validateWebhook = (req: Request, res: Response, next: Function) => {
  const webhookSecret = req.headers['x-webhook-secret'];
  
  if (!webhookSecret || webhookSecret !== WEBHOOK_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid webhook secret'
    });
  }
  
  next();
};

/**
 * Receive newsletter content from n8n
 */
export const receiveNewsletterContent = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    
    // Process content via n8n service
    const content = await n8nService.receiveContent(payload);
    
    return res.status(201).json({
      success: true,
      message: 'Newsletter content received and processed successfully',
      data: {
        contentId: content._id,
        title: content.title,
        contentDate: content.contentDate
      }
    });
  } catch (error: any) {
    console.error('Error receiving newsletter content:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing newsletter content',
      error: error.message
    });
  }
};

/**
 * Trigger newsletter distribution via n8n
 */
export const triggerNewsletterDistribution = async (req: Request, res: Response) => {
  try {
    const { contentId, options } = req.body;
    
    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: 'Content ID is required'
      });
    }
    
    // Trigger distribution via n8n service
    const result = await n8nService.triggerNewsletterDistribution(contentId, options);
    
    return res.status(200).json({
      success: true,
      message: 'Newsletter distribution triggered successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Error triggering newsletter distribution:', error);
    return res.status(500).json({
      success: false,
      message: 'Error triggering newsletter distribution',
      error: error.message
    });
  }
};

/**
 * Send test newsletter via n8n
 */
export const sendTestNewsletter = async (req: Request, res: Response) => {
  try {
    const { contentId, email } = req.body;
    
    if (!contentId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Content ID and email are required'
      });
    }
    
    // Send test newsletter via n8n service
    const result = await n8nService.sendTestNewsletter(contentId, email);
    
    return res.status(200).json({
      success: true,
      message: 'Test newsletter sent successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Error sending test newsletter:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending test newsletter',
      error: error.message
    });
  }
};

/**
 * Check workflow status
 */
export const checkWorkflowStatus = async (req: Request, res: Response) => {
  try {
    const { executionId } = req.params;
    
    if (!executionId) {
      return res.status(400).json({
        success: false,
        message: 'Execution ID is required'
      });
    }
    
    // Check workflow status via n8n service
    const result = await n8nService.checkWorkflowStatus(executionId);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error checking workflow status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking workflow status',
      error: error.message
    });
  }
};

export default {
  validateWebhook,
  receiveNewsletterContent,
  triggerNewsletterDistribution,
  sendTestNewsletter,
  checkWorkflowStatus
}; 
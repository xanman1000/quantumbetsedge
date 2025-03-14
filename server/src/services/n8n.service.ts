import axios from 'axios';
import { IContent } from '../models/content.model';
import { processAndStoreContent } from './content.service';
import dotenv from 'dotenv';

dotenv.config();

const n8nUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
const n8nApiKey = process.env.N8N_API_KEY || '';

// Main service for n8n interactions
export const n8nService = {
  // Receive content from n8n webhook
  receiveContent: async (payload: any): Promise<IContent> => {
    try {
      // Extract content from webhook payload
      // Payload format will depend on how you configure n8n workflow
      const {
        title = `Newsletter ${new Date().toLocaleDateString()}`,
        htmlContent,
        contentDate = new Date(),
        sports = [],
        tierAvailability = ['FREE', 'DAILY', 'WEEKLY', 'MONTHLY'],
        isPublished = false,
      } = payload;

      if (!htmlContent) {
        throw new Error('HTML content is required');
      }

      // Store the content using the content service
      const content = await processAndStoreContent(
        htmlContent,
        title,
        new Date(contentDate),
        sports,
        tierAvailability,
        isPublished
      );

      return content;
    } catch (error) {
      console.error('Error processing content from n8n:', error);
      throw error;
    }
  },

  // Trigger an n8n workflow to send newsletters
  triggerNewsletterDistribution: async (contentId: string, options = {}) => {
    try {
      // Call n8n webhook to trigger the distribution workflow
      const response = await axios.post(
        `${n8nUrl}/webhook/newsletter-distribution`,
        {
          contentId,
          options
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': n8nApiKey
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error triggering n8n workflow:', error);
      throw error;
    }
  },

  // Send test newsletter to specified email
  sendTestNewsletter: async (contentId: string, email: string) => {
    try {
      // Call n8n webhook to trigger test send
      const response = await axios.post(
        `${n8nUrl}/webhook/send-test-newsletter`,
        {
          contentId,
          email
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': n8nApiKey
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending test newsletter:', error);
      throw error;
    }
  },

  // Get status of a running workflow
  checkWorkflowStatus: async (executionId: string) => {
    try {
      // This requires n8n API access
      const response = await axios.get(
        `${n8nUrl}/api/v1/executions/${executionId}`,
        {
          headers: {
            'X-N8N-API-KEY': n8nApiKey
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error checking workflow status:', error);
      throw error;
    }
  }
};

export default n8nService; 
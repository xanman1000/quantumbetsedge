import { Request, Response } from 'express';
import Content, { IContent } from '../models/content.model';
import { SubscriptionTier } from '../models/subscriber.model';
import mongoose from 'mongoose';
import { logger } from '../config/logger.config';

/**
 * Utility function to strip HTML tags from content
 */
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Add new newsletter content
 * @route POST /api/content
 * @access Private (Admin)
 */
export const addContent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      htmlContent,
      plainTextContent,
      smsContent,
      contentDate,
      sports,
      tierAvailability,
      isPublished
    } = req.body;

    if (!title || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Title and HTML content are required'
      });
    }

    // Create plain text version if not provided
    const finalPlainTextContent = plainTextContent || stripHtml(htmlContent);

    const newContent = new Content({
      title,
      htmlContent,
      plainTextContent: finalPlainTextContent,
      smsContent,
      contentDate: contentDate || new Date(),
      sports: sports || [],
      tierAvailability: tierAvailability || [SubscriptionTier.FREE],
      isPublished: isPublished || false
    });

    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      data: savedContent
    });
  } catch (error) {
    logger.error(`Error in addContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Server error while adding content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all content items with pagination and filtering
 */
export const getAllContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type as string;
    
    // Build query based on filters
    const query: Record<string, any> = {};
    if (type) {
      query.type = type;
    }
    
    // Get total count for pagination
    const total = await Content.countDocuments(query);
    
    // Get content items
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      data: content,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Error in getAllContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a single content item by ID
 */
export const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error(`Error in getContentById: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create a new content item
 */
export const createContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body, type, status, author, tags, metadata } = req.body;
    
    // Create content
    const content = await Content.create({
      title,
      body,
      type,
      status: status || 'draft',
      author,
      tags: tags || [],
      metadata: metadata || {}
    });
    
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error(`Error in createContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update an existing content item
 */
export const updateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body, type, status, author, tags, metadata } = req.body;
    
    // Find content and update
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        body,
        type,
        status,
        author,
        tags,
        metadata,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error(`Error in updateContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete a content item
 */
export const deleteContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    
    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    logger.error(`Error in deleteContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Publish a content item (change status to published)
 */
export const publishContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: content,
      message: 'Content published successfully'
    });
  } catch (error) {
    logger.error(`Error in publishContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to publish content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get content items by type (e.g., blog, newsletter, announcement)
 */
export const getContentByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const type = req.params.type;
    
    // Get total count for pagination
    const total = await Content.countDocuments({ type });
    
    // Get content items
    const content = await Content.find({ type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      data: content,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Error in getContentByType: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Search content items based on keywords
 */
export const searchContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword as string;
    
    if (!keyword) {
      res.status(400).json({
        success: false,
        message: 'Search keyword is required'
      });
      return;
    }
    
    // Create search query with regex
    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { body: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ]
    };
    
    const content = await Content.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: content,
      count: content.length
    });
  } catch (error) {
    logger.error(`Error in searchContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to search content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update content analytics
 * @route POST /api/content/:id/analytics
 * @access Private (Admin)
 */
export const updateContentAnalytics = async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const { eventType, count = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }

    if (!eventType) {
      return res.status(400).json({
        success: false,
        message: 'Event type is required'
      });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Update analytics based on event type
    const updateData: Record<string, number> = {};
    
    switch (eventType) {
      case 'view':
        updateData['analytics.views'] = count;
        break;
      case 'click':
        updateData['analytics.clicks'] = count;
        break;
      case 'emailSent':
        updateData['analytics.emailsSent'] = count;
        break;
      case 'emailOpened':
        updateData['analytics.emailsOpened'] = count;
        break;
      case 'smsSent':
        updateData['analytics.smsSent'] = count;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid event type'
        });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { $inc: updateData },
      { new: true }
    );

    // Calculate and update conversion rate
    if (updatedContent && updatedContent.analytics.emailsSent > 0) {
      const conversionRate = (updatedContent.analytics.clicks / updatedContent.analytics.emailsSent) * 100;
      updatedContent.analytics.conversionRate = parseFloat(conversionRate.toFixed(2));
      await updatedContent.save();
    }

    res.status(200).json({
      success: true,
      data: updatedContent
    });
  } catch (error) {
    logger.error(`Error in updateContentAnalytics: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Server error while updating content analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Process and store content from n8n webhook
 * @route POST /api/n8n/webhook/content
 * @access Private (Webhook with secret)
 */
export const processAndStoreContent = async (req: Request, res: Response) => {
  try {
    // Validate webhook secret
    const webhookSecret = req.headers['x-webhook-secret'];
    
    if (!webhookSecret || webhookSecret !== process.env.N8N_WEBHOOK_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized webhook request'
      });
    }

    const {
      title,
      htmlContent,
      contentDate,
      sports,
      tierAvailability,
      isPublished = false
    } = req.body;

    if (!title || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Title and HTML content are required'
      });
    }

    // Generate plain text and SMS versions
    const plainTextContent = stripHtml(htmlContent);
    const smsContent = plainTextContent.substring(0, 160); // Simple SMS content truncation

    const newContent = new Content({
      title,
      htmlContent,
      plainTextContent,
      smsContent,
      contentDate: contentDate || new Date(),
      sports: sports || [],
      tierAvailability: tierAvailability || [SubscriptionTier.FREE],
      isPublished
    });

    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      message: 'Content processed and stored successfully',
      data: savedContent
    });
  } catch (error) {
    logger.error(`Error in processAndStoreContent: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Server error while processing content from webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 
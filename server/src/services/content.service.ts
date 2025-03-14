import { v4 as uuidv4 } from 'uuid';
import Content, { IContent } from '../models/content.model';
import { SubscriptionTier } from '../models/subscriber.model';
import { formatPicksForSms } from './sms.service';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { generatePlainTextFromHTML } from '../utils/htmlUtils';

dotenv.config();

/**
 * Simple function to extract plain text from HTML
 */
const extractPlainText = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Process and store newsletter content
 */
export const processAndStoreContent = async (
  htmlContent: string,
  title: string,
  contentDate: Date,
  sports: string[] = [],
  tierAvailability: string[] = ['FREE', 'DAILY', 'WEEKLY', 'MONTHLY'],
  isPublished: boolean = false
): Promise<IContent> => {
  try {
    // Generate plain text content from HTML
    const plainTextContent = extractPlainText(htmlContent);
    
    // Create new content document
    const content = new Content({
      title,
      htmlContent,
      plainTextContent,
      contentDate,
      sports,
      tierAvailability,
      isPublished,
      analytics: {
        views: 0,
        clicks: 0,
        emailsSent: 0,
        emailsOpened: 0,
        smsSent: 0
      }
    });
    
    // Save to database
    await content.save();
    
    return content;
  } catch (error) {
    console.error('Error processing and storing content:', error);
    throw error;
  }
};

/**
 * Create SMS-friendly content
 */
const createSmsContent = (htmlContent: string): string => {
  // Extract betting picks from HTML content
  // This is a simplified implementation - would need to be customized based on actual content structure
  const picks = extractPicks(htmlContent);
  
  // Use the existing SMS formatting function
  return formatPicksForSms(picks);
};

/**
 * Extract picks from HTML content
 */
const extractPicks = (htmlContent: string): any[] => {
  // This is a placeholder implementation
  // Real implementation would depend on how the HTML is structured
  
  // Example: extract data that looks like picks from HTML
  const pickRegex = /<div[^>]*class="pick"[^>]*>(.*?)<\/div>/gs;
  const matches = [...htmlContent.matchAll(pickRegex)];
  
  return matches.map(match => {
    // Simplified example - real implementation would be more complex
    const pickHtml = match[1];
    
    // Extract details from the pick HTML
    const sport = extractValue(pickHtml, 'sport') || 'Unknown';
    const team = extractValue(pickHtml, 'team') || 'Unknown Team';
    const bet = extractValue(pickHtml, 'bet') || 'Moneyline';
    const odds = extractValue(pickHtml, 'odds') || 'Even';
    const units = extractValue(pickHtml, 'units') || '1';
    const analysis = extractValue(pickHtml, 'analysis') || '';
    
    return { sport, team, bet, odds, units, analysis };
  });
};

/**
 * Helper function to extract values from HTML
 */
const extractValue = (html: string, field: string): string | null => {
  const regex = new RegExp(`<span[^>]*class="${field}"[^>]*>(.*?)<\/span>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
};

/**
 * Extract sports from HTML content
 */
const extractSports = (htmlContent: string): string[] => {
  // This is a simplified implementation
  // Real implementation would depend on how sports are identified in the content
  const sports = new Set<string>();
  
  // Extract sports from the content
  const sportMatches = htmlContent.match(/<span[^>]*class="sport"[^>]*>(.*?)<\/span>/g) || [];
  
  sportMatches.forEach(match => {
    const sport = match.replace(/<\/?[^>]+(>|$)/g, '').trim();
    if (sport) {
      sports.add(sport);
    }
  });
  
  return Array.from(sports);
};

/**
 * Get latest newsletter content
 */
export const getLatestContent = async (includeFullContent: boolean = false, tier: string = 'FREE'): Promise<IContent | null> => {
  try {
    const query = {
      isPublished: true,
      tierAvailability: { $in: [tier] }
    };
    
    // Select fields based on access level
    let contentQuery = Content.findOne(query).sort({ contentDate: -1 });
    
    if (!includeFullContent) {
      contentQuery = contentQuery.select('-htmlContent');
    }
    
    const content = await contentQuery.exec();
    return content;
  } catch (error) {
    console.error('Error getting latest content:', error);
    throw error;
  }
};

/**
 * Get newsletter archive with pagination
 */
export const getContentArchive = async (
  page: number = 1,
  limit: number = 10,
  tier: string = 'FREE',
  sports: string[] = []
): Promise<{ content: IContent[], total: number }> => {
  try {
    const query: any = {
      isPublished: true,
      tierAvailability: { $in: [tier] }
    };
    
    // Add sports filter if provided
    if (sports.length > 0) {
      query.sports = { $in: sports };
    }
    
    // Get content with pagination
    const content = await Content.find(query)
      .sort({ contentDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    
    // Get total count for pagination
    const total = await Content.countDocuments(query);
    
    return { content, total };
  } catch (error) {
    console.error('Error getting content archive:', error);
    throw error;
  }
};

/**
 * Get content by ID
 */
export const getContentById = async (
  id: string,
  includeFullContent: boolean = false,
  tier: string = 'FREE'
): Promise<IContent | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid content ID');
    }
    
    const query = {
      _id: id,
      isPublished: true,
      tierAvailability: { $in: [tier] }
    };
    
    // Select fields based on access level
    let contentQuery = Content.findOne(query);
    
    if (!includeFullContent) {
      contentQuery = contentQuery.select('-htmlContent');
    }
    
    const content = await contentQuery.exec();
    return content;
  } catch (error) {
    console.error(`Error getting content with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update content by ID
 */
export const updateContent = async (
  id: string,
  updates: Partial<IContent>
): Promise<IContent | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid content ID');
    }
    
    const content = await Content.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    
    return content;
  } catch (error) {
    console.error(`Error updating content with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get content by date
 */
export const getContentByDate = async (date: Date): Promise<IContent | null> => {
  try {
    // Create date range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Find content for the specified date
    const content = await Content.findOne({
      contentDate: { $gte: startOfDay, $lte: endOfDay },
      isPublished: true
    });
    
    return content;
  } catch (error) {
    console.error('Error getting content by date:', error);
    throw error;
  }
};

/**
 * Update content analytics
 */
export const updateContentAnalytics = async (
  contentId: string,
  field: 'emailsSent' | 'emailsOpened' | 'emailClicks' | 'smsSent' | 'deliveryStatus.successful' | 'deliveryStatus.failed' | 'deliveryStatus.pending',
  increment: number = 1
): Promise<void> => {
  try {
    const updateField = `analyticData.${field}`;
    
    await Content.updateOne(
      { _id: contentId },
      { $inc: { [updateField]: increment } }
    );
  } catch (error) {
    console.error(`Error updating content analytics field ${field}:`, error);
    throw error;
  }
};

/**
 * Filter content based on subscriber tier
 */
export const filterContentForTier = (content: IContent, tier: SubscriptionTier): IContent => {
  // Check if content should be available for this tier
  if (!content.tierAvailability.includes(tier)) {
    // Return limited content
    return {
      ...content.toObject(),
      htmlContent: createLimitedContent(content.htmlContent, tier),
      plainTextContent: createLimitedContent(content.plainTextContent, tier),
      smsContent: 'Subscribe to our premium tiers for today\'s picks! Visit quantumbets.com/upgrade'
    } as IContent;
  }
  
  // For paid tiers, return full content
  return content;
};

/**
 * Create limited content for free tier
 */
const createLimitedContent = (content: string, tier: SubscriptionTier): string => {
  if (tier === SubscriptionTier.FREE) {
    // Free tier gets a teaser with limited information
    return `
      <div>
        <h2>Today's Free Pick Preview</h2>
        <p>Subscribe to our premium tiers to get all of today's picks and detailed analysis!</p>
        <a href="${process.env.SITE_URL || 'https://quantumbets.com'}/upgrade">Upgrade Now</a>
      </div>
    `;
  }
  
  // All other tiers get full content
  return content;
};

/**
 * Generate a unique tracking ID for email/SMS tracking
 */
export const generateTrackingId = (): string => {
  return uuidv4();
};

/**
 * Add tracking pixels and links to HTML content
 */
export const addTracking = (
  htmlContent: string,
  trackingId: string,
  baseUrl: string = process.env.API_URL || 'http://localhost:3000'
): string => {
  // Add tracking pixel for open tracking
  const trackingPixel = `<img src="${baseUrl}/api/tracking/open/${trackingId}" alt="" width="1" height="1" style="display:none;" />`;
  
  // Add tracking to links
  const trackedHtml = htmlContent.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/gi,
    `<a href="${baseUrl}/api/tracking/click/${trackingId}?url=$1"$2>`
  );
  
  // Add tracking pixel before closing body tag
  return trackedHtml.replace('</body>', `${trackingPixel}</body>`);
};

export default {
  processAndStoreContent,
  getContentByDate,
  getLatestContent,
  getContentArchive,
  getContentById,
  updateContent,
  updateContentAnalytics,
  filterContentForTier,
  generateTrackingId,
  addTracking
}; 
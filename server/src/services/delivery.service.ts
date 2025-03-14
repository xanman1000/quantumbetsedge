import { Types } from 'mongoose';
import Subscriber, { ISubscriber, SubscriptionTier } from '../models/subscriber.model';
import Content, { IContent } from '../models/content.model';
import Delivery, { IDelivery, DeliveryStatus, DeliveryChannel } from '../models/delivery.model';
import * as emailService from './email.service';
import * as smsService from './sms.service';
import * as contentService from './content.service';
import dotenv from 'dotenv';

dotenv.config();

// Define batch size for processing
const BATCH_SIZE = 50;

/**
 * Schedule content delivery to all subscribers
 */
export const scheduleDelivery = async (contentId: string): Promise<{ success: boolean, scheduled: number }> => {
  try {
    const content = await Content.findById(contentId);
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    // Count active subscribers
    const totalSubscribers = await Subscriber.countDocuments({ isActive: true });
    let processed = 0;
    
    // Process subscribers in batches to avoid memory issues
    for (let skip = 0; skip < totalSubscribers; skip += BATCH_SIZE) {
      const subscribers = await Subscriber.find({ isActive: true })
        .skip(skip)
        .limit(BATCH_SIZE);
      
      const deliveryPromises = subscribers.map(subscriber => 
        createDeliveryRecords(subscriber, content)
      );
      
      await Promise.all(deliveryPromises);
      processed += subscribers.length;
    }
    
    return { success: true, scheduled: processed };
  } catch (error) {
    console.error('Error scheduling delivery:', error);
    throw error;
  }
};

/**
 * Create delivery records for a subscriber
 */
const createDeliveryRecords = async (subscriber: ISubscriber, content: IContent): Promise<void> => {
  const deliveries: Partial<IDelivery>[] = [];
  
  // Create email delivery record if subscriber has email preferences enabled
  if (subscriber.communicationPreferences.email) {
    deliveries.push({
      subscriberId: subscriber._id,
      contentId: content._id,
      channel: DeliveryChannel.EMAIL,
      status: DeliveryStatus.PENDING,
      trackingId: contentService.generateTrackingId(),
    });
  }
  
  // Create SMS delivery record if subscriber has SMS preferences enabled
  // and is on a paid tier (DAILY, WEEKLY, MONTHLY)
  if (
    subscriber.communicationPreferences.sms && 
    subscriber.phone && 
    subscriber.subscriptionTier !== SubscriptionTier.FREE
  ) {
    deliveries.push({
      subscriberId: subscriber._id,
      contentId: content._id,
      channel: DeliveryChannel.SMS,
      status: DeliveryStatus.PENDING,
      trackingId: contentService.generateTrackingId(),
    });
  }
  
  if (deliveries.length > 0) {
    await Delivery.insertMany(deliveries);
  }
};

/**
 * Process pending deliveries
 */
export const processPendingDeliveries = async (): Promise<{ success: boolean, processed: number, failed: number }> => {
  try {
    // Find pending deliveries
    const totalPending = await Delivery.countDocuments({ status: DeliveryStatus.PENDING });
    let processed = 0;
    let failed = 0;
    
    // Process in batches
    for (let skip = 0; skip < totalPending; skip += BATCH_SIZE) {
      const pendingDeliveries = await Delivery.find({ status: DeliveryStatus.PENDING })
        .skip(skip)
        .limit(BATCH_SIZE)
        .populate('subscriberId')
        .populate('contentId');
      
      const deliveryPromises = pendingDeliveries.map(delivery => 
        processDelivery(delivery)
          .then(() => processed++)
          .catch((error: Error) => {
            console.error(`Error processing delivery ${delivery._id}:`, error);
            failed++;
            return updateDeliveryStatus(
              delivery._id.toString(), 
              DeliveryStatus.FAILED, 
              error.message
            );
          })
      );
      
      await Promise.all(deliveryPromises);
    }
    
    return { success: true, processed, failed };
  } catch (error) {
    console.error('Error processing pending deliveries:', error);
    throw error;
  }
};

/**
 * Process a single delivery
 */
const processDelivery = async (delivery: IDelivery & { 
  subscriberId: ISubscriber;
  contentId: IContent;
}): Promise<void> => {
  try {
    const subscriber = delivery.subscriberId;
    const content = delivery.contentId;
    
    // Filter content based on subscriber tier
    const filteredContent = contentService.filterContentForTier(content, subscriber.subscriptionTier);
    
    if (delivery.channel === DeliveryChannel.EMAIL) {
      await processEmailDelivery(delivery, subscriber, filteredContent);
    } else if (delivery.channel === DeliveryChannel.SMS) {
      await processSmsDelivery(delivery, subscriber, filteredContent);
    }
    
    // Update delivery status
    await updateDeliveryStatus(delivery._id.toString(), DeliveryStatus.SENT);
    
    // Update content analytics
    const analyticsField = delivery.channel === DeliveryChannel.EMAIL ? 'emailsSent' : 'smsSent';
    await contentService.updateContentAnalytics(content._id.toString(), analyticsField as any);
    await contentService.updateContentAnalytics(content._id.toString(), 'deliveryStatus.successful' as any);
  } catch (error) {
    console.error(`Error in processDelivery:`, error);
    // Update failed status
    await updateDeliveryStatus(delivery._id.toString(), DeliveryStatus.FAILED, (error as Error).message);
    await contentService.updateContentAnalytics(delivery.contentId._id.toString(), 'deliveryStatus.failed' as any);
    throw error;
  }
};

/**
 * Process email delivery
 */
const processEmailDelivery = async (
  delivery: IDelivery & { subscriberId: ISubscriber; }, 
  subscriber: ISubscriber, 
  content: IContent
): Promise<void> => {
  // Add tracking to HTML content
  const trackedHtml = contentService.addTracking(content.htmlContent, delivery.trackingId);
  
  // Send email
  await emailService.sendPicksEmail(subscriber.email, trackedHtml, content.title);
};

/**
 * Process SMS delivery
 */
const processSmsDelivery = async (
  delivery: IDelivery & { subscriberId: ISubscriber; }, 
  subscriber: ISubscriber, 
  content: IContent
): Promise<void> => {
  if (!subscriber.phone) {
    throw new Error('Subscriber has no phone number');
  }
  
  // Send SMS
  await smsService.sendPicksSms(subscriber.phone, content.smsContent);
};

/**
 * Update delivery status
 */
export const updateDeliveryStatus = async (
  deliveryId: string,
  status: DeliveryStatus,
  failureReason?: string
): Promise<void> => {
  try {
    const updateData: any = { 
      status,
      retryCount: { $inc: 1 }
    };
    
    // Add appropriate timestamp based on status
    switch (status) {
      case DeliveryStatus.SENT:
        updateData.sentAt = new Date();
        break;
      case DeliveryStatus.DELIVERED:
        updateData.deliveredAt = new Date();
        break;
      case DeliveryStatus.OPENED:
        updateData.openedAt = new Date();
        break;
      case DeliveryStatus.CLICKED:
        updateData.clickedAt = new Date();
        break;
      case DeliveryStatus.FAILED:
        updateData.failureReason = failureReason || 'Unknown error';
        break;
    }
    
    await Delivery.updateOne(
      { _id: new Types.ObjectId(deliveryId) },
      { $set: updateData }
    );
  } catch (error) {
    console.error(`Error updating delivery status for ${deliveryId}:`, error);
    throw error;
  }
};

/**
 * Retry failed deliveries
 */
export const retryFailedDeliveries = async (
  maxRetries: number = 3
): Promise<{ success: boolean, retried: number }> => {
  try {
    // Find failed deliveries with retryCount less than maxRetries
    const failedDeliveries = await Delivery.find({
      status: DeliveryStatus.FAILED,
      retryCount: { $lt: maxRetries }
    });
    
    // Reset status to pending
    await Delivery.updateMany(
      {
        status: DeliveryStatus.FAILED,
        retryCount: { $lt: maxRetries }
      },
      { $set: { status: DeliveryStatus.PENDING } }
    );
    
    return { success: true, retried: failedDeliveries.length };
  } catch (error) {
    console.error('Error retrying failed deliveries:', error);
    throw error;
  }
};

/**
 * Track open event
 */
export const trackOpen = async (trackingId: string): Promise<void> => {
  try {
    const delivery = await Delivery.findOne({ trackingId });
    if (!delivery) {
      throw new Error(`Delivery with tracking ID ${trackingId} not found`);
    }
    
    // Only track opens for email
    if (delivery.channel === DeliveryChannel.EMAIL) {
      await updateDeliveryStatus(delivery._id.toString(), DeliveryStatus.OPENED);
      await contentService.updateContentAnalytics(
        delivery.contentId.toString(), 
        'emailsOpened'
      );
    }
  } catch (error) {
    console.error(`Error tracking open for ${trackingId}:`, error);
    throw error;
  }
};

/**
 * Track click event
 */
export const trackClick = async (trackingId: string): Promise<void> => {
  try {
    const delivery = await Delivery.findOne({ trackingId });
    if (!delivery) {
      throw new Error(`Delivery with tracking ID ${trackingId} not found`);
    }
    
    // Only track clicks for email
    if (delivery.channel === DeliveryChannel.EMAIL) {
      await updateDeliveryStatus(delivery._id.toString(), DeliveryStatus.CLICKED);
      await contentService.updateContentAnalytics(
        delivery.contentId.toString(), 
        'emailClicks'
      );
    }
  } catch (error) {
    console.error(`Error tracking click for ${trackingId}:`, error);
    throw error;
  }
};

export default {
  scheduleDelivery,
  processPendingDeliveries,
  updateDeliveryStatus,
  retryFailedDeliveries,
  trackOpen,
  trackClick
}; 
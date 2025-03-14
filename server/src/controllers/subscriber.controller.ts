import { Request, Response } from 'express';
import Subscriber, { SubscriptionTier, ISubscriber } from '../models/subscriber.model';
import { logger } from '../config/logger.config';
import mongoose from 'mongoose';

/**
 * Add a new subscriber
 * @route POST /api/subscribers
 * @access Public
 */
export const addSubscriber = async (req: Request, res: Response) => {
  try {
    const { email, name, phone, subscriptionTier = SubscriptionTier.FREE } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: 'Email is already subscribed'
      });
    }
    
    // Create new subscriber
    const subscriber = new Subscriber({
      email,
      name,
      phone,
      subscriptionTier,
      isActive: true,
      emailVerified: false,
      preferences: {
        receiveSMS: !!phone,
        receiveEmail: true,
        categories: []
      }
    });
    
    await subscriber.save();
    
    // TODO: Send verification email
    
    return res.status(201).json({
      success: true,
      message: 'Subscriber added successfully',
      data: {
        id: subscriber._id,
        email: subscriber.email,
        subscriptionTier: subscriber.subscriptionTier
      }
    });
  } catch (error) {
    logger.error(`Error adding subscriber: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error adding subscriber',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Unsubscribe a subscriber
 * @route POST /api/subscribers/unsubscribe
 * @access Public
 */
export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { email, unsubscribeToken } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Find subscriber
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    // TODO: Validate unsubscribe token if implemented
    
    // Update subscriber
    subscriber.isActive = false;
    await subscriber.save();
    
    return res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    logger.error(`Error unsubscribing: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error unsubscribing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Verify subscriber email
 * @route POST /api/subscribers/verify-email
 * @access Public
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, verificationToken } = req.body;
    
    if (!email || !verificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification token are required'
      });
    }
    
    // Find subscriber
    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    // TODO: Validate verification token
    
    // Update subscriber
    subscriber.emailVerified = true;
    await subscriber.save();
    
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    logger.error(`Error verifying email: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all subscribers (with pagination and filtering)
 * @route GET /api/subscribers
 * @access Private (Admin)
 */
export const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const subscriptionTier = req.query.subscriptionTier as string;
    const isActive = req.query.isActive as string;
    
    // Build query
    const query: Record<string, any> = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (subscriptionTier) {
      query.subscriptionTier = subscriptionTier;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Execute query with pagination
    const subscribers = await Subscriber.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count
    const total = await Subscriber.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Error getting subscribers: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error getting subscribers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get subscriber by ID
 * @route GET /api/subscribers/:id
 * @access Private (Admin)
 */
export const getSubscriberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscriber ID format'
      });
    }
    
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: subscriber
    });
  } catch (error) {
    logger.error(`Error getting subscriber: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error getting subscriber',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update subscriber
 * @route PUT /api/subscribers/:id
 * @access Private (Admin)
 */
export const updateSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, preferences, isActive } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscriber ID format'
      });
    }
    
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    // Update fields
    if (name !== undefined) subscriber.name = name;
    if (phone !== undefined) subscriber.phone = phone;
    if (isActive !== undefined) subscriber.isActive = isActive;
    
    // Update preferences if provided
    if (preferences) {
      if (preferences.receiveEmail !== undefined) {
        subscriber.preferences.receiveEmail = preferences.receiveEmail;
      }
      if (preferences.receiveSMS !== undefined) {
        subscriber.preferences.receiveSMS = preferences.receiveSMS;
      }
      if (preferences.categories) {
        subscriber.preferences.categories = preferences.categories;
      }
    }
    
    await subscriber.save();
    
    return res.status(200).json({
      success: true,
      message: 'Subscriber updated successfully',
      data: subscriber
    });
  } catch (error) {
    logger.error(`Error updating subscriber: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error updating subscriber',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete subscriber
 * @route DELETE /api/subscribers/:id
 * @access Private (Admin)
 */
export const deleteSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscriber ID format'
      });
    }
    
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting subscriber: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error deleting subscriber',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Upgrade subscription
 * @route PUT /api/subscribers/:id/upgrade
 * @access Private (Admin)
 */
export const upgradeSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subscriptionTier, paymentDetails } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscriber ID format'
      });
    }
    
    if (!subscriptionTier || !Object.values(SubscriptionTier).includes(subscriptionTier as SubscriptionTier)) {
      return res.status(400).json({
        success: false,
        message: 'Valid subscription tier is required'
      });
    }
    
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    // Update subscription tier
    subscriber.subscriptionTier = subscriptionTier as SubscriptionTier;
    
    // Update payment details if provided
    if (paymentDetails) {
      if (paymentDetails.lastPaymentId) {
        subscriber.paymentDetails.lastPaymentId = paymentDetails.lastPaymentId;
      }
      if (paymentDetails.lastPaymentDate) {
        subscriber.paymentDetails.lastPaymentDate = new Date(paymentDetails.lastPaymentDate);
      }
      if (paymentDetails.subscriptionId) {
        subscriber.paymentDetails.subscriptionId = paymentDetails.subscriptionId;
      }
      if (paymentDetails.nextBillingDate) {
        subscriber.paymentDetails.nextBillingDate = new Date(paymentDetails.nextBillingDate);
      }
    }
    
    await subscriber.save();
    
    return res.status(200).json({
      success: true,
      message: 'Subscription upgraded successfully',
      data: {
        id: subscriber._id,
        email: subscriber.email,
        subscriptionTier: subscriber.subscriptionTier,
        paymentDetails: subscriber.paymentDetails
      }
    });
  } catch (error) {
    logger.error(`Error upgrading subscription: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Error upgrading subscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default {
  addSubscriber,
  unsubscribe,
  verifyEmail,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
  upgradeSubscription
}; 
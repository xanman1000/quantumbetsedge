import { Request, Response } from 'express';
import Subscriber, { SubscriptionTier } from '../models/subscriber.model';
import stripeService from '../services/stripe.service';
import emailService from '../services/email.service';
import smsService from '../services/sms.service';

/**
 * Create a free subscription
 */
export const createFreeSubscription = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new subscriber
    subscriber = new Subscriber({
      email,
      subscriptionTier: SubscriptionTier.FREE,
      communicationPreferences: {
        email: true,
        sms: false, // SMS is not available for free tier
      },
    });

    await subscriber.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(email, 'free');

    return res.status(201).json({
      message: 'Free subscription created successfully',
      data: {
        email: subscriber.email,
        tier: subscriber.subscriptionTier,
      },
    });
  } catch (error) {
    console.error('Error creating free subscription:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a checkout session for a paid subscription
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { email, tier, phone } = req.body;

    if (!email || !tier) {
      return res.status(400).json({ message: 'Email and tier are required' });
    }

    // Validate tier
    const validTiers = ['daily', 'weekly', 'monthly'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({ message: 'Invalid subscription tier' });
    }

    // Validate phone number if provided
    if (phone) {
      const isValidPhone = smsService.validateUSPhoneNumber(phone);
      if (!isValidPhone) {
        return res.status(400).json({ message: 'Invalid US phone number format' });
      }
    }

    // Map frontend tier names to backend enum
    const tierMap: Record<string, SubscriptionTier> = {
      daily: SubscriptionTier.DAILY,
      weekly: SubscriptionTier.WEEKLY,
      monthly: SubscriptionTier.MONTHLY,
    };

    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email });
    let customerId;

    if (subscriber) {
      // Use existing Stripe customer if available
      customerId = subscriber.stripeCustomerId;
      
      // Update phone if provided and different
      if (phone && subscriber.phone !== phone) {
        subscriber.phone = phone;
        subscriber.communicationPreferences.sms = true;
        await subscriber.save();
      }
    } else {
      // Create a new subscriber
      subscriber = new Subscriber({
        email,
        phone: phone || undefined, // Store phone if provided
        subscriptionTier: SubscriptionTier.FREE, // Will be updated after payment
        communicationPreferences: {
          email: true,
          sms: !!phone, // Enable SMS if phone is provided
        },
      });

      await subscriber.save();

      // Create a new Stripe customer
      const customer = await stripeService.createCustomer(email);
      customerId = customer.id;

      // Update subscriber with Stripe customer ID
      subscriber.stripeCustomerId = customerId;
      await subscriber.save();
    }

    // Create success and cancel URLs
    const successUrl = `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/cancel`;

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      email,
      tier as 'daily' | 'weekly' | 'monthly',
      successUrl,
      cancelUrl,
      customerId
    );

    return res.status(200).json({
      message: 'Checkout session created',
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the subscriber
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    // If there's a Stripe subscription, cancel it
    if (subscriber.stripeSubscriptionId) {
      await stripeService.cancelSubscription(subscriber.stripeSubscriptionId);
    }

    // Update subscriber status
    subscriber.isActive = false;
    subscriber.subscriptionTier = SubscriptionTier.FREE;
    await subscriber.save();

    // Send cancellation notifications
    await emailService.sendCancellationEmail(email);
    
    if (subscriber.phone && subscriber.communicationPreferences.sms) {
      await smsService.sendCancellationSms(subscriber.phone);
    }

    return res.status(200).json({
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update communication preferences
 */
export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const { email, preferences, phone } = req.body;

    if (!email || !preferences) {
      return res.status(400).json({ message: 'Email and preferences are required' });
    }

    // Find subscriber
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    // Validate phone number if SMS is enabled
    if (preferences.sms && phone) {
      const isValidPhone = smsService.validateUSPhoneNumber(phone);
      if (!isValidPhone) {
        return res.status(400).json({ message: 'Invalid US phone number format' });
      }
      
      // Update phone number
      subscriber.phone = phone;
    } else if (preferences.sms && !phone && !subscriber.phone) {
      return res.status(400).json({ message: 'Phone number is required for SMS notifications' });
    }

    // Update preferences
    subscriber.communicationPreferences = {
      email: preferences.email !== undefined ? preferences.email : subscriber.communicationPreferences.email,
      sms: preferences.sms !== undefined ? preferences.sms : subscriber.communicationPreferences.sms,
    };

    await subscriber.save();

    return res.status(200).json({
      message: 'Communication preferences updated',
      data: {
        preferences: subscriber.communicationPreferences,
      },
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createFreeSubscription,
  createCheckoutSession,
  cancelSubscription,
  updatePreferences,
}; 
import { Request, Response } from 'express';
import Subscriber, { SubscriptionTier } from '../models/subscriber.model';
import stripeService from '../services/stripe.service';
import emailService from '../services/email.service';
import smsService from '../services/sms.service';

/**
 * Handle Stripe webhook events
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({ message: 'Stripe signature is missing' });
  }

  try {
    // Verify and construct the webhook event
    const event = stripeService.constructWebhookEvent(
      req.body,
      signature
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        await handleSubscriptionCreated(subscription);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(400).json({ message: 'Webhook error' });
  }
};

/**
 * Handle checkout.session.completed event
 */
const handleCheckoutSessionCompleted = async (session: any) => {
  try {
    const customerEmail = session.customer_email || session.customer_details?.email;
    
    if (!customerEmail) {
      console.error('No email found in completed checkout session:', session.id);
      return;
    }

    // Find the subscriber
    const subscriber = await Subscriber.findOne({ 
      email: customerEmail 
    });

    if (!subscriber) {
      console.error('Subscriber not found for email:', customerEmail);
      return;
    }

    // Update subscriber with Stripe customer ID if not already set
    if (!subscriber.stripeCustomerId && session.customer) {
      subscriber.stripeCustomerId = session.customer;
    }

    // Handle one-time payments (daily tier)
    if (session.mode === 'payment') {
      subscriber.subscriptionTier = SubscriptionTier.DAILY;
      subscriber.lastPaymentDate = new Date();
      
      // Daily tier expires after 24 hours
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      subscriber.nextBillingDate = tomorrow;

      await subscriber.save();

      // Send confirmation notifications
      await emailService.sendSubscriptionConfirmationEmail(
        subscriber.email, 
        'daily'
      );

      if (subscriber.phone && subscriber.communicationPreferences.sms) {
        await smsService.sendSubscriptionConfirmationSms(
          subscriber.phone, 
          'daily'
        );
      }
    }
    
    // For subscription mode, we'll handle in the subscription.created event
    await subscriber.save();
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
    throw error;
  }
};

/**
 * Handle customer.subscription.created event
 */
const handleSubscriptionCreated = async (subscription: any) => {
  try {
    // Get customer ID from subscription
    const customerId = subscription.customer;
    
    // Find subscriber by Stripe customer ID
    const subscriber = await Subscriber.findOne({ 
      stripeCustomerId: customerId 
    });

    if (!subscriber) {
      console.error('Subscriber not found for customer:', customerId);
      return;
    }

    // Update subscription details
    subscriber.stripeSubscriptionId = subscription.id;
    
    // Set subscription tier based on price
    const priceId = subscription.items.data[0].price.id;
    
    if (priceId === process.env.STRIPE_WEEKLY_PRICE_ID) {
      subscriber.subscriptionTier = SubscriptionTier.WEEKLY;
    } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
      subscriber.subscriptionTier = SubscriptionTier.MONTHLY;
    }

    subscriber.isActive = subscription.status === 'active' || subscription.status === 'trialing';
    
    // Set trial end date if applicable
    if (subscription.trial_end) {
      subscriber.freeTrialEnd = new Date(subscription.trial_end * 1000);
    }
    
    // Set next billing date
    if (subscription.current_period_end) {
      subscriber.nextBillingDate = new Date(subscription.current_period_end * 1000);
    }

    await subscriber.save();

    // Send confirmation notifications
    const tierName = subscriber.subscriptionTier.toLowerCase();
    
    await emailService.sendSubscriptionConfirmationEmail(
      subscriber.email, 
      tierName
    );

    if (subscriber.phone && subscriber.communicationPreferences.sms) {
      await smsService.sendSubscriptionConfirmationSms(
        subscriber.phone, 
        tierName
      );
    }
  } catch (error) {
    console.error('Error handling customer.subscription.created:', error);
    throw error;
  }
};

/**
 * Handle customer.subscription.updated event
 */
const handleSubscriptionUpdated = async (subscription: any) => {
  try {
    // Get customer ID from subscription
    const customerId = subscription.customer;
    
    // Find subscriber by Stripe customer ID
    const subscriber = await Subscriber.findOne({ 
      stripeCustomerId: customerId 
    });

    if (!subscriber) {
      console.error('Subscriber not found for customer:', customerId);
      return;
    }

    // Update subscription status
    subscriber.isActive = subscription.status === 'active' || subscription.status === 'trialing';
    
    // Update next billing date
    if (subscription.current_period_end) {
      subscriber.nextBillingDate = new Date(subscription.current_period_end * 1000);
    }

    await subscriber.save();
  } catch (error) {
    console.error('Error handling customer.subscription.updated:', error);
    throw error;
  }
};

/**
 * Handle customer.subscription.deleted event
 */
const handleSubscriptionDeleted = async (subscription: any) => {
  try {
    // Get customer ID from subscription
    const customerId = subscription.customer;
    
    // Find subscriber by Stripe customer ID
    const subscriber = await Subscriber.findOne({ 
      stripeCustomerId: customerId 
    });

    if (!subscriber) {
      console.error('Subscriber not found for customer:', customerId);
      return;
    }

    // Update subscription status and tier
    subscriber.isActive = false;
    subscriber.subscriptionTier = SubscriptionTier.FREE;
    subscriber.stripeSubscriptionId = undefined;
    
    await subscriber.save();

    // Send cancellation notifications
    await emailService.sendCancellationEmail(subscriber.email);

    if (subscriber.phone && subscriber.communicationPreferences.sms) {
      await smsService.sendCancellationSms(subscriber.phone);
    }
  } catch (error) {
    console.error('Error handling customer.subscription.deleted:', error);
    throw error;
  }
};

/**
 * Handle invoice.payment_succeeded event
 */
const handleInvoicePaymentSucceeded = async (invoice: any) => {
  try {
    // Get customer ID from invoice
    const customerId = invoice.customer;
    
    // Find subscriber by Stripe customer ID
    const subscriber = await Subscriber.findOne({ 
      stripeCustomerId: customerId 
    });

    if (!subscriber) {
      console.error('Subscriber not found for customer:', customerId);
      return;
    }

    // Update last payment date
    subscriber.lastPaymentDate = new Date();
    
    await subscriber.save();
  } catch (error) {
    console.error('Error handling invoice.payment_succeeded:', error);
    throw error;
  }
};

/**
 * Handle invoice.payment_failed event
 */
const handleInvoicePaymentFailed = async (invoice: any) => {
  try {
    // Get customer ID from invoice
    const customerId = invoice.customer;
    
    // Find subscriber by Stripe customer ID
    const subscriber = await Subscriber.findOne({ 
      stripeCustomerId: customerId 
    });

    if (!subscriber) {
      console.error('Subscriber not found for customer:', customerId);
      return;
    }

    // We don't immediately deactivate on first payment failure
    // Stripe will retry the payment according to its settings
    
    // Could send a payment failure notification here
    // await emailService.sendPaymentFailedEmail(subscriber.email);

    await subscriber.save();
  } catch (error) {
    console.error('Error handling invoice.payment_failed:', error);
    throw error;
  }
};

export default {
  handleWebhook,
}; 
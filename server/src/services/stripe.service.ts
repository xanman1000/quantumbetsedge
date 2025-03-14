import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Define product/price IDs for each subscription tier
// These should be created in the Stripe dashboard and the IDs stored here
const STRIPE_PRODUCTS = {
  daily: process.env.STRIPE_DAILY_PRICE_ID || 'price_daily',
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID || 'price_weekly',
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
};

/**
 * Create a new customer in Stripe
 */
export const createCustomer = async (email: string, name?: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

/**
 * Create a subscription checkout session
 */
export const createCheckoutSession = async (
  email: string, 
  tier: 'daily' | 'weekly' | 'monthly',
  successUrl: string,
  cancelUrl: string,
  customerId?: string,
  trialDays: number = 3,
) => {
  try {
    // Set the price based on the tier
    const priceId = STRIPE_PRODUCTS[tier];
    
    // Create the session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: tier === 'daily' ? 'payment' : 'subscription',
      subscription_data: tier === 'daily' ? undefined : {
        trial_period_days: trialDays,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Retrieve a subscription from Stripe
 */
export const getSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
};

/**
 * Cancel a subscription in Stripe
 */
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Verify a webhook signature from Stripe
 */
export const constructWebhookEvent = (
  payload: Buffer,
  signature: string,
) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
    return event;
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
};

export default {
  createCustomer,
  createCheckoutSession,
  getSubscription,
  cancelSubscription,
  constructWebhookEvent,
}; 
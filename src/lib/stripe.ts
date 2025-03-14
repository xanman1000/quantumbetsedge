import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId: string, customerEmail?: string) => {
  try {
    // Call your backend to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerEmail,
      }),
    });

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Failed to load Stripe');
    
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export { stripePromise }; 
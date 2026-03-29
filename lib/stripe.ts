import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(publishableKey: string): Promise<Stripe | null> {
  if (!stripePromise && publishableKey) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise || Promise.resolve(null);
}

export interface StripePaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

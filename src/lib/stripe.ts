import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Keep in sync with the Stripe SDK's supported apiVersion union.
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

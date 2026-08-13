import {
  createCheckoutSession,
  createBillingPortalSession,
  getStripe,
  handleStripeWebhookEvent,
} from '../handlers/stripe.js';
import { requireEmailVerified } from '../handlers/emailVerification.js';
import User from '../models/User.js';

function requireAuth(req, res) {
  if (!req.isAuthenticated?.() || !req.user) {
    res.status(401).json({
      success: false,
      code: 'NOT_AUTHENTICATED',
      message: 'Please log in to continue.',
    });
    return null;
  }
  return req.user;
}

export const createCheckout = [
  requireEmailVerified,
  async (req, res) => {
    try {
      const sessionUser = req.user;
      const user = await User.findById(sessionUser._id);
      if (!user || user.status === 'deleted') {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      if (user.subscriptionStatus === 'active') {
        return res.status(400).json({
          success: false,
          code: 'ALREADY_SUBSCRIBED',
          message: 'You already have an active subscription.',
        });
      }

      const plan = String(req.body?.plan || 'monthly').toLowerCase();
      if (!['monthly', 'yearly'].includes(plan)) {
        return res.status(400).json({
          success: false,
          code: 'INVALID_PLAN',
          message: 'Please choose a monthly or yearly plan.',
        });
      }

      const session = await createCheckoutSession(user, plan);
      return res.json({
        success: true,
        url: session.url,
      });
    } catch (error) {
      console.error('Stripe checkout error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Unable to start checkout. Please try again later.',
      });
    }
  },
];

export const createPortal = async (req, res) => {
  try {
    const sessionUser = requireAuth(req, res);
    if (!sessionUser) return;

    const user = await User.findById(sessionUser._id);
    if (!user || user.status === 'deleted') {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        code: 'NO_STRIPE_CUSTOMER',
        message: 'No billing account found. Subscribe first.',
      });
    }

    const session = await createBillingPortalSession(user);
    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe portal error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to open billing portal. Please try again later.',
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).send('Webhook not configured');
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    await handleStripeWebhookEvent(event);
    return res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook handler error:', error.message);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
};

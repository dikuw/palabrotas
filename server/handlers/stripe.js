import Stripe from 'stripe';
import User from '../models/User.js';
import { getFrontendUrl } from './mail.js';

export const FREE_LESSON_MAX = 15;

export const SUBSCRIPTION_STATUSES = ['none', 'active', 'past_due', 'canceled', 'incomplete'];

let stripeClient;

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secret);
  }
  return stripeClient;
}

export function mapStripeSubscriptionStatus(stripeStatus) {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
    case 'unpaid':
      return 'canceled';
    case 'incomplete':
    case 'incomplete_expired':
      return 'incomplete';
    default:
      return 'none';
  }
}

export function hasActiveSubscription(user) {
  return user?.subscriptionStatus === 'active';
}

export function canAccessLesson(user, lessonNumber) {
  const number = Number(lessonNumber);
  if (!Number.isFinite(number)) return false;
  if (number <= FREE_LESSON_MAX) return true;
  if (user?.isAdmin) return true;
  return hasActiveSubscription(user);
}

/**
 * Resolve a Stripe Price ID for a billing plan.
 * Prefers STRIPE_PRICE_ID_MONTHLY / STRIPE_PRICE_ID_YEARLY.
 * Falls back to STRIPE_PRICE_ID / PRODUCT_ID for single-price setups.
 */
export function resolvePriceId(plan = 'monthly') {
  const normalized = String(plan || 'monthly').toLowerCase();

  if (normalized === 'yearly' || normalized === 'year' || normalized === 'annual') {
    const yearly =
      process.env.STRIPE_PRICE_ID_YEARLY ||
      process.env.STRIPE_PRICE_YEARLY;
    if (yearly) return yearly;
  }

  if (normalized === 'monthly' || normalized === 'month') {
    const monthly =
      process.env.STRIPE_PRICE_ID_MONTHLY ||
      process.env.STRIPE_PRICE_MONTHLY;
    if (monthly) return monthly;
  }

  const fallback =
    process.env.STRIPE_PRICE_ID ||
    process.env.PRODUCT_ID ||
    process.env.STRIPE_PRODUCT_ID;

  if (!fallback) {
    throw new Error(
      'Stripe price is not configured. Set STRIPE_PRICE_ID_MONTHLY and STRIPE_PRICE_ID_YEARLY.'
    );
  }

  if (fallback.startsWith('prod_')) {
    throw new Error(
      'PRODUCT_ID alone is ambiguous when multiple prices exist. Use STRIPE_PRICE_ID_MONTHLY / STRIPE_PRICE_ID_YEARLY.'
    );
  }

  return fallback;
}

export async function createCheckoutSession(user, plan = 'monthly') {
  const stripe = getStripe();
  const priceId = resolvePriceId(plan);
  const frontendUrl = getFrontendUrl();

  const sessionParams = {
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${frontendUrl}/account?checkout=success`,
    cancel_url: `${frontendUrl}/account?checkout=cancel`,
    client_reference_id: String(user._id),
    metadata: {
      userId: String(user._id),
      plan: String(plan || 'monthly'),
    },
    subscription_data: {
      metadata: {
        userId: String(user._id),
        plan: String(plan || 'monthly'),
      },
    },
  };

  if (user.stripeCustomerId) {
    sessionParams.customer = user.stripeCustomerId;
  } else {
    sessionParams.customer_email = user.email;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

export async function createBillingPortalSession(user) {
  if (!user.stripeCustomerId) {
    throw new Error('No Stripe customer on this account');
  }

  const stripe = getStripe();
  const frontendUrl = getFrontendUrl();

  return stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${frontendUrl}/account`,
  });
}

/**
 * Cancel an active Stripe subscription for a user, if present.
 * Prefers stripeSubscriptionId; falls back to listing by customer.
 */
export async function cancelActiveSubscription(user) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { cancelled: false, reason: 'none' };
  }

  try {
    const stripe = getStripe();
    let subscriptionId = user?.stripeSubscriptionId;

    if (!subscriptionId && user?.stripeCustomerId) {
      const subs = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'all',
        limit: 10,
      });
      const live = subs.data.find((s) =>
        ['active', 'trialing', 'past_due', 'incomplete'].includes(s.status)
      );
      subscriptionId = live?.id;
    }

    if (!subscriptionId) {
      return { cancelled: false, reason: 'none' };
    }

    await stripe.subscriptions.cancel(subscriptionId);
    return { cancelled: true, subscriptionId };
  } catch (error) {
    console.error('Stripe subscription cancel error:', error.message);
    return { cancelled: false, reason: 'error', message: error.message };
  }
}

async function findUserForStripeEvent({ userId, customerId, subscriptionId }) {
  if (userId) {
    const byId = await User.findById(userId);
    if (byId) return byId;
  }
  if (subscriptionId) {
    const bySub = await User.findOne({ stripeSubscriptionId: subscriptionId });
    if (bySub) return bySub;
  }
  if (customerId) {
    const byCustomer = await User.findOne({ stripeCustomerId: customerId });
    if (byCustomer) return byCustomer;
  }
  return null;
}

export async function applySubscriptionToUser(user, {
  customerId,
  subscriptionId,
  status,
}) {
  const updates = {};
  if (customerId) updates.stripeCustomerId = customerId;
  if (subscriptionId) updates.stripeSubscriptionId = subscriptionId;
  if (status) updates.subscriptionStatus = mapStripeSubscriptionStatus(status);

  Object.assign(user, updates);
  await user.save();
  return user;
}

export async function handleStripeWebhookEvent(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode !== 'subscription') break;

      const userId = session.client_reference_id || session.metadata?.userId;
      const customerId = typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id;
      const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

      const user = await findUserForStripeEvent({ userId, customerId, subscriptionId });
      if (!user) {
        console.error('Stripe checkout.session.completed: no user found', { userId, customerId });
        break;
      }

      let status = 'active';
      if (subscriptionId) {
        try {
          const stripe = getStripe();
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          status = sub.status;
        } catch (err) {
          console.error('Failed to retrieve subscription after checkout:', err.message);
        }
      }

      await applySubscriptionToUser(user, { customerId, subscriptionId, status });
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;
      const subscriptionId = subscription.id;
      const userId = subscription.metadata?.userId;

      const user = await findUserForStripeEvent({ userId, customerId, subscriptionId });
      if (!user) {
        console.error(`${event.type}: no user found`, { userId, customerId, subscriptionId });
        break;
      }

      const status = event.type === 'customer.subscription.deleted'
        ? 'canceled'
        : subscription.status;

      await applySubscriptionToUser(user, {
        customerId,
        subscriptionId,
        status,
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = typeof invoice.customer === 'string'
        ? invoice.customer
        : invoice.customer?.id;
      const subscriptionId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id;

      const user = await findUserForStripeEvent({ customerId, subscriptionId });
      if (!user) {
        console.error('invoice.payment_failed: no user found', { customerId, subscriptionId });
        break;
      }

      await applySubscriptionToUser(user, {
        customerId,
        subscriptionId,
        status: 'past_due',
      });
      break;
    }

    default:
      break;
  }
}

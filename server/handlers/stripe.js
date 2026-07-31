/**
 * Cancel an active Stripe subscription for a user, if present.
 * Uses the Stripe REST API so we don't require the stripe SDK until billing is fully wired.
 * No-ops when Stripe is not configured or the user has no subscription id.
 */
export async function cancelActiveSubscription(user) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const subscriptionId = user?.stripeSubscriptionId;

  if (!secret || !subscriptionId) {
    return { cancelled: false, reason: 'none' };
  }

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error('Stripe subscription cancel failed:', response.status, body);
      // Don't block account deletion on Stripe errors — log and continue
      return { cancelled: false, reason: 'stripe_error', status: response.status };
    }

    return { cancelled: true };
  } catch (error) {
    console.error('Stripe subscription cancel error:', error.message);
    return { cancelled: false, reason: 'error' };
  }
}

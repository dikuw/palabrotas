/**
 * Client-side gate for future Stripe checkout / subscribe flows.
 * Free tier (lessons 1–15) should remain accessible without verification.
 */
export function canStartSubscription(user) {
  // Legacy users may omit the field; only explicit false blocks checkout
  return user != null && user.emailVerified !== false;
}

export const EMAIL_NOT_VERIFIED_MESSAGE =
  'Please verify your email before subscribing';

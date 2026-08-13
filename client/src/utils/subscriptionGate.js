/**
 * Client-side helpers for Stripe subscription + email verification gates.
 * Free tier (lessons 1–15) remains accessible without verification or subscription.
 */

export const FREE_LESSON_MAX = 15;

export function canStartSubscription(user) {
  // Legacy users may omit the field; only explicit false blocks checkout
  return user != null && user.emailVerified !== false;
}

export function hasActiveSubscription(user) {
  return user?.subscriptionStatus === 'active' || user?.isAdmin === true;
}

export function canAccessLesson(user, lessonNumber) {
  const number = Number(lessonNumber);
  if (!Number.isFinite(number)) return false;
  if (number <= FREE_LESSON_MAX) return true;
  return hasActiveSubscription(user);
}

export const EMAIL_NOT_VERIFIED_MESSAGE =
  'Please verify your email before subscribing';

export const SUBSCRIPTION_REQUIRED_MESSAGE =
  'This lesson requires an active subscription.';

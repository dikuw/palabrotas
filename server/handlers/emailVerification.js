import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail, getFrontendUrl } from './mail.js';

const VERIFICATION_TOKEN_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function issueEmailVerification(user) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = hashToken(rawToken);
  user.emailVerificationExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await user.save();

  const verifyURL = `${getFrontendUrl()}/verify-email?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Verify your email for Palabrotas',
    textBody: [
      `Hi ${user.name || 'there'},`,
      '',
      'Thanks for signing up for Palabrotas. Please verify your email address:',
      verifyURL,
      '',
      'This link expires in 48 hours.',
      '',
      'If you did not create an account, you can ignore this email.',
    ].join('\n'),
    htmlBody: `
      <p>Hi ${user.name || 'there'},</p>
      <p>Thanks for signing up for Palabrotas. Please verify your email address:</p>
      <p><a href="${verifyURL}">Verify my email</a></p>
      <p>This link expires in 48 hours.</p>
      <p>If you did not create an account, you can ignore this email.</p>
    `,
  });

  return rawToken;
}

export async function findUserByVerificationToken(rawToken) {
  const hashed = hashToken(String(rawToken));
  return User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: new Date() },
  });
}

/**
 * Middleware for future Stripe checkout / subscribe routes.
 * Free tier access should NOT use this middleware.
 */
export function requireEmailVerified(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.status(401).json({
      success: false,
      code: 'NOT_AUTHENTICATED',
      message: 'Please log in to continue.',
    });
  }

  if (req.user.emailVerified === false) {
    return res.status(403).json({
      success: false,
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Please verify your email before subscribing.',
    });
  }

  return next();
}

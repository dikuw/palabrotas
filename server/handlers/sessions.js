import mongoose from 'mongoose';

/**
 * Delete all express-session documents that belong to a user.
 */
export async function invalidateUserSessions(userId) {
  try {
    const sessions = mongoose.connection.collection('sessions');
    await sessions.deleteMany({
      session: new RegExp(String(userId)),
    });
  } catch (error) {
    console.error('Error invalidating user sessions:', error.message);
  }
}

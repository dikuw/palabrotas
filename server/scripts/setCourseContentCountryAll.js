/**
 * One-off: set country to "all" for all course/lesson Content documents.
 * Run: node server/scripts/setCourseContentCountryAll.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from '../models/Content.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Content.updateMany(
    { isCourseContent: true },
    { $set: { country: 'all' } }
  );
  console.log(`Matched: ${result.matchedCount}, modified: ${result.modifiedCount}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

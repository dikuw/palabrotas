import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const migrationScript = async () => {
  try {
    // Connect to MongoDB using the correct environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database...');

    // Update all existing users
    const result = await User.updateMany(
      { loginCount: { $exists: false } }, // Find users without these fields
      { 
        $set: {
          loginCount: 0,
          lastLogin: null,
          loginHistory: []
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users`);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

// Run the migration
migrationScript();
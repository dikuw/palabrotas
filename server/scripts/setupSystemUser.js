import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const SYSTEM_USER_EMAIL = 'system@palabrotas.com';
const SYSTEM_USER_NAME = 'System';

const setupSystemUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database...\n');

    // Check if system user already exists
    let systemUser = await User.findOne({ email: SYSTEM_USER_EMAIL });
    
    if (systemUser) {
      console.log(`👤 System user already exists:`);
      console.log(`   Email: ${systemUser.email}`);
      console.log(`   Name: ${systemUser.name}`);
      console.log(`   Admin: ${systemUser.isAdmin ? 'Yes' : 'No'}`);
      console.log(`   ID: ${systemUser._id}`);
      
      // Update to ensure it's an admin if it wasn't before
      if (!systemUser.isAdmin) {
        systemUser.isAdmin = true;
        await systemUser.save();
        console.log(`\n✅ Updated user to admin status`);
      } else {
        console.log(`\n✅ User is already set up correctly`);
      }
    } else {
      console.log('📝 Creating system user...');
      
      // Get password from environment variable or generate a secure random one
      // Note: System user won't be able to login via frontend, but password is required by passport
      const password = process.env.SYSTEM_USER_PASSWORD || generateSecurePassword();
      
      // Create the user using passport-local-mongoose's register method
      const newUser = new User({
        email: SYSTEM_USER_EMAIL,
        name: SYSTEM_USER_NAME,
        isAdmin: true
      });
      
      await User.register(newUser, password);
      
      console.log('✅ System user created successfully!');
      console.log(`   Email: ${SYSTEM_USER_EMAIL}`);
      console.log(`   Name: ${SYSTEM_USER_NAME}`);
      console.log(`   Admin: Yes`);
      console.log(`   ID: ${newUser._id}`);
      
      if (!process.env.SYSTEM_USER_PASSWORD) {
        console.log(`\n⚠️  Note: A random password was generated.`);
        console.log(`   The system user cannot login via the frontend.`);
        console.log(`   If you need to set a specific password, set SYSTEM_USER_PASSWORD in your .env file and run this script again.`);
      } else {
        console.log(`\n✅ Password set from SYSTEM_USER_PASSWORD environment variable`);
      }
    }

    console.log('\n✅ Setup completed successfully!');
    console.log('   You can now use this user for importing course content.');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    if (error.name === 'UserExistsError') {
      console.error('\n💡 The user already exists. The script should have detected this.');
      console.error('   Try running the script again or check the database manually.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database');
  }
};

// Generate a secure random password (won't be used for login, but required by passport)
function generateSecurePassword() {
  const length = 32;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Run the setup
setupSystemUser();


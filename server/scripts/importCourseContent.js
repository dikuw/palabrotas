import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import Content from '../models/Content.js';
import Lesson from '../models/Lesson.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get file path from command line argument or use default
const filePathArg = process.argv[2];
let filePath, fullPath;

if (filePathArg) {
  // If path starts with server/ or ../, resolve relative to project root
  // Otherwise, assume it's relative to the script directory
  if (filePathArg.startsWith('server/') || filePathArg.startsWith('../')) {
    // Resolve from project root (go up from scripts/ to server/, then to root)
    const projectRoot = join(__dirname, '../..');
    fullPath = join(projectRoot, filePathArg);
    filePath = filePathArg;
  } else if (filePathArg.startsWith('/') || filePathArg.match(/^[A-Z]:/)) {
    // Absolute path (Unix or Windows)
    fullPath = filePathArg;
    filePath = filePathArg;
  } else {
    // Relative to script directory
    fullPath = join(__dirname, filePathArg);
    filePath = filePathArg;
  }
} else {
  // Default: courseData.js in data directory
  filePath = '../data/courseData.js';
  fullPath = join(__dirname, filePath);
}

const importCourseContent = async () => {
  try {
    // Import the lesson data
    let lessonsToImport = [];
    
    try {
      // Convert path to file:// URL for ES module dynamic import (required on Windows)
      const fileUrl = pathToFileURL(fullPath).href;
      
      // Try to import the file
      const module = await import(fileUrl);
      
      // Check if it exports 'lesson' (single lesson) or 'courseData' (array of lessons)
      if (module.lesson) {
        // Single lesson format
        lessonsToImport = [module.lesson];
        console.log(`📁 Importing from: ${filePath}`);
        console.log(`📚 Found 1 lesson\n`);
      } else if (module.courseData) {
        // Array of lessons format
        lessonsToImport = Array.isArray(module.courseData) ? module.courseData : [module.courseData];
        console.log(`📁 Importing from: ${filePath}`);
        console.log(`📚 Found ${lessonsToImport.length} lesson(s)\n`);
      } else {
        throw new Error('File must export either "lesson" or "courseData"');
      }
    } catch (importError) {
      if (importError.code === 'ERR_MODULE_NOT_FOUND' || importError.code === 'ENOENT') {
        console.error(`❌ File not found: ${filePath}`);
        console.error(`   Full path attempted: ${fullPath}`);
        console.error('\n💡 Usage:');
        console.error('   node server/scripts/importCourseContent.js [path/to/lessonFile.js]');
        console.error('\n   Examples:');
        console.error('   node server/scripts/importCourseContent.js server/data/lesson1.js');
        console.error('   node server/scripts/importCourseContent.js server/data/courseData.js');
        console.error('   node server/scripts/importCourseContent.js ../data/lesson1.js');
        process.exit(1);
      }
      throw importError;
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database...\n');

    // Find or create a system user for course content
    // You can modify this to use a specific user email or create a system user
    let systemUser = await User.findOne({ email: 'system@palabrotas.com' });
    
    if (!systemUser) {
      // Try to find an admin user instead
      systemUser = await User.findOne({ isAdmin: true });
      
      if (!systemUser) {
        console.log('⚠️  No system user found. Creating one...');
        // Create a system user (you'll need to set a password manually if needed)
        systemUser = new User({
          email: 'system@palabrotas.com',
          name: 'System',
          isAdmin: true
        });
        // Note: This user won't be able to login without a password set via passport
        // You may want to create this user manually first
        await systemUser.save();
        console.log('✅ Created system user');
      }
    }

    console.log(`📝 Using user: ${systemUser.name} (${systemUser.email})\n`);

    const author = systemUser.name;
    const ownerId = systemUser._id;

    // Track statistics
    let contentCreated = 0;
    let contentSkipped = 0;
    let lessonsCreated = 0;
    let lessonsSkipped = 0;

    // Process each lesson
    for (const lessonData of lessonsToImport) {
      console.log(`\n📚 Processing Lesson ${lessonData.lessonNumber}: ${lessonData.title}`);

      // Check if lesson already exists
      const existingLesson = await Lesson.findOne({ lessonNumber: lessonData.lessonNumber });
      if (existingLesson) {
        console.log(`   ⚠️  Lesson ${lessonData.lessonNumber} already exists. Skipping...`);
        lessonsSkipped++;
        continue;
      }

      // Create Content entries for vocabulary
      const vocabularyIds = [];
      
      for (const vocab of lessonData.vocabulary) {
        // Check if content already exists (by title and isCourseContent)
        const existingContent = await Content.findOne({ 
          title: vocab.title,
          isCourseContent: true 
        });

        if (existingContent) {
          console.log(`   ⚠️  Content "${vocab.title}" already exists. Using existing...`);
          vocabularyIds.push(existingContent._id);
          contentSkipped++;
        } else {
          // Create new content
          const newContent = new Content({
            title: vocab.title,
            description: vocab.description,
            hint: vocab.hint || '',
            exampleSentence: vocab.exampleSentence || '',
            country: vocab.country || 'CO',
            isCourseContent: true,
            owner: ownerId,
            author: author,
            show: true,
            version: 0
          });

          await newContent.save();
          vocabularyIds.push(newContent._id);
          contentCreated++;
          console.log(`   ✅ Created content: "${vocab.title}"`);
        }
      }

      // Create Lesson
      const newLesson = new Lesson({
        title: lessonData.title,
        description: lessonData.description,
        lessonNumber: lessonData.lessonNumber,
        vocabulary: vocabularyIds,
        owner: ownerId,
        author: author,
        show: true
      });

      await newLesson.save();
      lessonsCreated++;
      console.log(`   ✅ Created lesson with ${vocabularyIds.length} vocabulary items`);
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Content created: ${contentCreated}`);
    console.log(`⚠️  Content skipped: ${contentSkipped}`);
    console.log(`✅ Lessons created: ${lessonsCreated}`);
    console.log(`⚠️  Lessons skipped: ${lessonsSkipped}`);
    console.log('='.repeat(50));
    console.log('\n✅ Import completed successfully!');

  } catch (error) {
    console.error('❌ Import failed:', error);
    if (error.message && error.message.includes('export')) {
      console.error('\n💡 Your lesson file must export either:');
      console.error('   - export const lesson = { ... }  (for single lesson)');
      console.error('   - export const courseData = [ ... ]  (for multiple lessons)');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database');
  }
};

// Run the import
importCourseContent();


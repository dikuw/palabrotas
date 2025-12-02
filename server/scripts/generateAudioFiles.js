import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Content from '../models/Content.js';
import AudioFile from '../models/AudioFile.js';

dotenv.config();

// Spanish (US) voices - alternating between female and male
const VOICES = [
  { name: 'es-US-Neural2-A', gender: 'female' },
  { name: 'es-US-Neural2-B', gender: 'male' },
  { name: 'es-US-Neural2-A', gender: 'female' } // Alternate back to female
];

const generateAudioFiles = async () => {
  try {
    // Check for GCS bucket name
    if (!process.env.GCS_BUCKET_NAME) {
      console.error('❌ GCS_BUCKET_NAME not found in .env file');
      console.error('   Please add GCS_BUCKET_NAME to your .env file');
      process.exit(1);
    }

    // Check for credentials (multiple options supported)
    if (!process.env.GCP_CREDENTIALS_JSON && 
        !process.env.GOOGLE_APPLICATION_CREDENTIALS && 
        !process.env.VERTEX_API_KEY) {
      console.error('❌ No Google Cloud credentials found');
      console.error('\n💡 For local development:');
      console.error('   Set GOOGLE_APPLICATION_CREDENTIALS=path/to/gcp-key.json');
      console.error('\n💡 For production:');
      console.error('   Set GCP_CREDENTIALS_JSON with the JSON content as a string');
      console.error('   Or use Application Default Credentials (for GCP-hosted services)');
      console.error('\n   See docs/deployment/gcp-production.md for production setup');
      process.exit(1);
    }

    // Initialize Google Cloud Text-to-Speech client
    // Note: For Vertex AI, you might need to use different authentication
    // This uses the standard Google Cloud TTS client
    let ttsClient;
    let storageClient;
    try {
      // Get credentials configuration
      // Priority order:
      // 1. GCP_CREDENTIALS_JSON (JSON content as string - for production/admin environments)
      // 2. GOOGLE_APPLICATION_CREDENTIALS (file path - for local dev)
      // 3. VERTEX_API_KEY (file path or JSON string - legacy support)
      // 4. Application Default Credentials (for GCP-hosted services)
      let credentialsConfig = {};

      if (process.env.GCP_CREDENTIALS_JSON) {
        // Production/Admin: JSON content stored as environment variable
        try {
          const credentials = typeof process.env.GCP_CREDENTIALS_JSON === 'string' 
            ? JSON.parse(process.env.GCP_CREDENTIALS_JSON)
            : process.env.GCP_CREDENTIALS_JSON;
          credentialsConfig = { credentials };
        } catch (parseError) {
          throw new Error('GCP_CREDENTIALS_JSON is not valid JSON. Make sure it\'s properly escaped.');
        }
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Local development: Path to JSON key file
        credentialsConfig = { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS };
      } else if (process.env.VERTEX_API_KEY) {
        // Legacy support: Can be file path or JSON string
        if (process.env.VERTEX_API_KEY.startsWith('{')) {
          // It's a JSON string
          try {
            const credentials = JSON.parse(process.env.VERTEX_API_KEY);
            credentialsConfig = { credentials };
          } catch (parseError) {
            throw new Error('VERTEX_API_KEY JSON is invalid');
          }
        } else {
          // It's a file path
          credentialsConfig = { keyFilename: process.env.VERTEX_API_KEY };
        }
      }
      // Otherwise, will use Application Default Credentials (for GCP-hosted services)

      ttsClient = new TextToSpeechClient(credentialsConfig);
      storageClient = new Storage(credentialsConfig);
    } catch (error) {
      console.error('❌ Failed to initialize Google Cloud clients:', error.message);
      if (error.message.includes('Could not load the default credentials') || 
          error.message.includes('could not load the default credentials') ||
          error.code === 7) {
        console.error('\n❌ Authentication Error: Could not load credentials');
        console.error('\n📋 Quick Setup:');
        console.error('   1. Create a service account: https://console.cloud.google.com/iam-admin/serviceaccounts');
        console.error('   2. Grant roles: "Storage Object Admin" and "Cloud Text-to-Speech API User"');
        console.error('   3. Create a JSON key and download it');
        console.error('   4. Add to .env: GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json');
        console.error('\n   See server/scripts/SETUP_GCP.md for detailed instructions');
      } else {
        console.error('\n💡 For Google Cloud services, you need:');
        console.error('   1. Set GOOGLE_APPLICATION_CREDENTIALS to path to service account JSON file, OR');
        console.error('   2. Set VERTEX_API_KEY to the path of your service account JSON file, OR');
        console.error('   3. Set VERTEX_API_KEY to the JSON content of your service account');
      }
      process.exit(1);
    }

    // Get the GCS bucket and verify access
    const bucket = storageClient.bucket(process.env.GCS_BUCKET_NAME);
    
    try {
      // Check if bucket exists and is accessible
      const [exists] = await bucket.exists();
      if (!exists) {
        console.error(`❌ GCS bucket "${process.env.GCS_BUCKET_NAME}" does not exist`);
        console.error('   Please create the bucket or check the bucket name in your .env file');
        console.error('   Bucket name should match exactly (case-sensitive)');
        process.exit(1);
      }
      
      // Test access by getting metadata
      await bucket.getMetadata();
      console.log('✅ Bucket access verified');
    } catch (error) {
      if (error.message.includes('Could not load the default credentials') || 
          error.message.includes('could not load the default credentials') ||
          error.code === 7) {
        console.error('\n❌ Authentication Error: Could not load credentials');
        console.error('\n📋 Quick Setup:');
        console.error('   1. Create a service account: https://console.cloud.google.com/iam-admin/serviceaccounts');
        console.error('   2. Grant roles: "Storage Object Admin" and "Cloud Text-to-Speech API User"');
        console.error('   3. Create a JSON key and download it');
        console.error('   4. Add to .env: GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json');
        console.error('\n   See server/scripts/SETUP_GCP.md for detailed instructions');
        process.exit(1);
      } else if (error.code === 403) {
        console.error(`\n❌ Permission denied accessing bucket "${process.env.GCS_BUCKET_NAME}"`);
        console.error('\n💡 Your service account needs "Storage Object Admin" role');
        console.error('   1. Go to: https://console.cloud.google.com/storage/browser');
        console.error(`   2. Click on your bucket: ${process.env.GCS_BUCKET_NAME}`);
        console.error('   3. Go to the "Permissions" tab');
        console.error('   4. Click "Grant Access"');
        console.error('   5. Add your service account email (from the JSON key file)');
        console.error('   6. Grant role: "Storage Object Admin"');
        console.error('   7. Click "Save"');
        console.error('\n   Or use IAM: https://console.cloud.google.com/iam-admin/iam');
        process.exit(1);
      } else {
        console.error(`❌ Error accessing GCS bucket "${process.env.GCS_BUCKET_NAME}":`, error.message);
        console.error('   Please check your credentials and bucket name');
        process.exit(1);
      }
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database...\n');
    console.log(`📦 Using GCS bucket: ${process.env.GCS_BUCKET_NAME}\n`);

    // Find all Content with isCourseContent = true
    const allCourseContent = await Content.find({ isCourseContent: true });
    console.log(`📚 Found ${allCourseContent.length} course content items\n`);

    // Find Content that don't have audio files yet
    const contentWithoutAudio = [];
    for (const content of allCourseContent) {
      const audioCount = await AudioFile.countDocuments({ content: content._id });
      if (audioCount === 0) {
        contentWithoutAudio.push(content);
      }
    }

    console.log(`🎵 Content items without audio: ${contentWithoutAudio.length}`);
    if (contentWithoutAudio.length === 0) {
      console.log('✅ All course content already has audio files!');
      return;
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎤 Starting audio generation...');
    console.log('='.repeat(50) + '\n');

    let successCount = 0;
    let errorCount = 0;
    let filesGenerated = 0;

    // Process each content item
    for (const content of contentWithoutAudio) {
      console.log(`\n📝 Processing: "${content.title}"`);
      console.log(`   Description: ${content.description}`);

      let contentSuccess = true;
      const audioFiles = [];

      // Generate 3 audio files with alternating voices
      for (let i = 0; i < 3; i++) {
        const voice = VOICES[i];
        const text = content.title; // Use the title as the text to speak
        
        try {
          console.log(`   🎤 Generating audio ${i + 1}/3 with voice ${voice.name} (${voice.gender})...`);

          // Request audio synthesis
          const [response] = await ttsClient.synthesizeSpeech({
            input: { text },
            voice: {
              languageCode: 'es-US',
              name: voice.name,
            },
            audioConfig: {
              audioEncoding: 'MP3',
            },
          });

          // Generate filename for GCS
          const filename = `audio/content_${content._id}_${i + 1}.mp3`;
          const file = bucket.file(filename);

          // Check if file already exists in GCS
          const [fileExists] = await file.exists();
          let audioUrl;

          if (fileExists) {
            // File already exists, just get the URL
            console.log(`   ⚠️  File already exists in GCS: ${filename}`);
            audioUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${filename}`;
            
            // Check if AudioFile record already exists
            const existingAudioFile = await AudioFile.findOne({
              content: content._id,
              audioUrl: audioUrl
            });

            if (existingAudioFile) {
              console.log(`   ⚠️  AudioFile record already exists, skipping...`);
              filesGenerated++;
              continue;
            }
          } else {
            // Upload audio to Google Cloud Storage
            await file.save(response.audioContent, {
              metadata: {
                contentType: 'audio/mpeg',
                cacheControl: 'public, max-age=31536000', // Cache for 1 year
              },
            });

            // Make the file publicly accessible
            await file.makePublic();

            // Get the public URL
            audioUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${filename}`;
            console.log(`   ✅ Generated and uploaded: ${filename}`);
            console.log(`   🔗 URL: ${audioUrl}`);
          }

          // Create AudioFile record
          const audioFile = new AudioFile({
            content: content._id,
            audioUrl,
            voice: voice.name,
            gender: voice.gender,
            languageCode: 'es-US',
            audioFormat: 'mp3',
            order: i + 1
          });

          await audioFile.save();
          audioFiles.push(audioFile);
          filesGenerated++;
          console.log(`   💾 Saved AudioFile record: ${audioFile._id}`);

        } catch (error) {
          console.error(`   ❌ Error generating audio ${i + 1}/3:`, error.message);
          if (error.errors) {
            console.error(`   Validation errors:`, JSON.stringify(error.errors, null, 2));
          }
          if (error.stack) {
            console.error(`   Stack trace:`, error.stack);
          }
          contentSuccess = false;
          errorCount++;
        }
      }

      if (contentSuccess) {
        successCount++;
        console.log(`   ✅ Successfully generated 3 audio files for "${content.title}"`);
      } else {
        console.log(`   ⚠️  Some audio files failed for "${content.title}"`);
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Generation Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Content items processed successfully: ${successCount}`);
    console.log(`⚠️  Content items with errors: ${errorCount}`);
    console.log(`🎵 Total audio files generated: ${filesGenerated}`);
    
    // Verify records were saved
    const totalAudioFilesInDB = await AudioFile.countDocuments();
    console.log(`💾 Total AudioFile records in database: ${totalAudioFilesInDB}`);
    
    // Count audio files for the content we just processed
    let verifiedCount = 0;
    for (const content of contentWithoutAudio) {
      const count = await AudioFile.countDocuments({ content: content._id });
      verifiedCount += count;
    }
    console.log(`✅ Verified AudioFile records for processed content: ${verifiedCount}`);
    
    console.log('='.repeat(50));
    console.log('\n✅ Audio generation completed!');

  } catch (error) {
    console.error('❌ Generation failed:', error);
    if (error.message && error.message.includes('credentials')) {
      console.error('\n💡 Authentication Error:');
      console.error('   Make sure you have set up Google Cloud credentials correctly.');
      console.error('   Options:');
      console.error('   1. Set GOOGLE_APPLICATION_CREDENTIALS to path of service account JSON');
      console.error('   2. Set VERTEX_API_KEY to path of service account JSON file');
      console.error('   3. Or ensure Application Default Credentials are configured');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database');
  }
};

// Run the generation
generateAudioFiles();


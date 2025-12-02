# Google Cloud Platform Setup Guide

This guide will help you set up Google Cloud Platform credentials for the **audio generation script** (`generateAudioFiles.js`).

## Important Note

**GCP credentials are only needed for generating audio files**, not for running the production application. The audio generation script:
- Generates audio files using Google Cloud Text-to-Speech
- Uploads them to Google Cloud Storage as public files
- Stores the public URLs in the database

Once generated, the production application only reads these public URLs from the database - no GCP credentials needed in production!

## Step 1: Create a Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **IAM & Admin** > **Service Accounts**: https://console.cloud.google.com/iam-admin/serviceaccounts
4. Click **"Create Service Account"**
5. Fill in the details:
   - **Service account name**: `palabrotas-audio` (or any name you prefer)
   - **Service account ID**: Will auto-populate
   - Click **"Create and Continue"**

## Step 2: Grant Required Permissions

1. In the **"Grant this service account access to project"** section, add these roles:
   - **Storage Object Admin** - For uploading files to Google Cloud Storage
   - **Cloud Text-to-Speech API User** - For generating audio using Text-to-Speech API
2. Click **"Continue"**
3. Click **"Done"**

## Step 3: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the **"Keys"** tab
3. Click **"Add Key"** > **"Create new key"**
4. Select **JSON** format
5. Click **"Create"** - This will download a JSON file
6. **IMPORTANT**: Save this file somewhere secure on your computer
   - Example location: `server/config/gcp-key.json`
   - **DO NOT commit this file to git!**

## Step 4: Enable Required APIs

1. Go to [APIs & Services](https://console.cloud.google.com/apis/library)
2. Enable these APIs (if not already enabled):
   - **Cloud Text-to-Speech API**
   - **Cloud Storage API**

## Step 5: Set Up Bucket Permissions

1. Go to [Cloud Storage](https://console.cloud.google.com/storage/browser)
2. Click on your bucket: `palabrotas-audio`
3. Go to the **"Permissions"** tab
4. Click **"Grant Access"**
5. In **"New principals"**, enter your service account email (found in the JSON file as `client_email`)
6. Select role: **"Storage Object Admin"**
7. Click **"Save"**

Alternatively, you can grant permissions via IAM:
1. Go to [IAM & Admin](https://console.cloud.google.com/iam-admin/iam)
2. Find your service account
3. Click the edit icon (pencil)
4. Click **"Add Another Role"**
5. Add: **"Storage Object Admin"**
6. Click **"Save"**

## Step 6: Configure Your .env File

### For Local Development

Add these lines to your `.env` file:

```env
# Google Cloud Storage
GCS_BUCKET_NAME=palabrotas-audio

# Google Cloud Credentials (Local Development)
# Option 1: Path to the JSON key file (recommended for local)
GOOGLE_APPLICATION_CREDENTIALS=server/config/gcp-key.json

# Option 2: Or use VERTEX_API_KEY pointing to the JSON file (legacy)
# VERTEX_API_KEY=server/config/gcp-key.json
```

**Important Notes:**
- Use the **absolute path** if relative paths don't work: `C:\Users\YourName\Documents\...\gcp-key.json`
- On Windows, use forward slashes or escaped backslashes: `C:/path/to/file.json` or `C:\\path\\to\\file.json`
- Make sure the path is correct and the file exists

### For Running the Script on a Server/Admin Environment

If you need to run the audio generation script on a server (not production app, but an admin environment), you can use:

1. **Environment Variable with JSON Content**:
   ```env
   GCS_BUCKET_NAME=palabrotas-audio
   GCP_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"..."}
   ```
   Paste the entire JSON content as a single line (remove newlines).

2. **Application Default Credentials** (For GCP-hosted services):
   - Attach the service account to your Cloud Run/App Engine instance
   - No environment variables needed!

**Note**: The production application itself does NOT need GCP credentials - it only reads public URLs from the database.

## Step 7: Verify Setup

Run the script to test:

```bash
node server/scripts/generateAudioFiles.js
```

If you see "✅ Bucket access verified", you're all set!

## Troubleshooting

### "Could not load the default credentials"
- Make sure `GOOGLE_APPLICATION_CREDENTIALS` points to the correct file path
- Verify the JSON file exists and is readable
- Try using an absolute path instead of a relative path

### "Permission denied" or "403 Forbidden"
- Make sure the service account has "Storage Object Admin" role
- Verify the service account email matches the one in your JSON file
- Check that the bucket name in `.env` matches exactly (case-sensitive)

### "Bucket does not exist"
- Verify the bucket name in `.env` matches exactly: `palabrotas-audio`
- Check that you're using the correct Google Cloud project

### APIs not enabled
- Go to [APIs & Services](https://console.cloud.google.com/apis/library)
- Search for "Cloud Text-to-Speech API" and enable it
- Search for "Cloud Storage API" and enable it

## Security Best Practices

1. **Never commit the JSON key file to git**
   - Add it to `.gitignore`: `server/config/gcp-key.json`
   - Or store it outside your project directory

2. **Restrict service account permissions**
   - Only grant the minimum permissions needed
   - Use "Storage Object Admin" (not "Storage Admin" which is broader)

3. **Rotate keys periodically**
   - Delete old keys and create new ones
   - Update your `.env` file with the new key path


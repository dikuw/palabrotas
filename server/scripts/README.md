# Course Content Import Script

This script imports course content (lessons and vocabulary) from a JavaScript data file into the database. You can import individual lessons or multiple lessons at once.

## Setup

### 1. Set Up System User (Recommended)

Before importing course content, set up the system user that will own all course content:

```bash
node server/scripts/setupSystemUser.js
```

This script will:
- Create a user with email `system@palabrotas.com`
- Set the user as an admin
- Generate a secure random password (or use `SYSTEM_USER_PASSWORD` from `.env` if set)

**Note:** The system user is not meant to login via the frontend. It's only used to own course content in the database.

**Optional:** You can set a specific password by adding this to your `.env` file:
```
SYSTEM_USER_PASSWORD=your-secure-password-here
```

If the user already exists, the script will verify it's set up correctly and update it if needed.

### 2. Create Your Lesson Files

- For a single lesson: Copy `../data/lesson.example.js` to `../data/lesson1.js` (or any name)
- For multiple lessons: Copy `../data/courseData.example.js` to `../data/courseData.js`
- Fill in your lesson data following the example format

## Data Formats

### Single Lesson Format

Your lesson file should export a single lesson object:

```javascript
export const lesson = {
  lessonNumber: 1,
  title: "Lesson 1: Greetings",
  description: "Learn basic Spanish greetings",
  vocabulary: [
    {
      title: "Hola",
      description: "Hello",
      hint: "Common greeting", // Optional
      exampleSentence: "Hola, ¿cómo estás?", // Optional
      country: "ES" // Optional, defaults to 'CO'
    }
    // ... more vocabulary items
  ]
};
```

### Multiple Lessons Format

Your `courseData.js` should export an array of lesson objects:

```javascript
export const courseData = [
  {
    lessonNumber: 1,
    title: "Lesson 1: Greetings",
    // ... lesson data
  },
  {
    lessonNumber: 2,
    title: "Lesson 2: Numbers",
    // ... lesson data
  }
];
```

## Running the Script

### Import a Single Lesson

From the project root:

```bash
# Using path from project root
node server/scripts/importCourseContent.js server/data/lesson1.js

# Or using relative path from script directory
node server/scripts/importCourseContent.js ../data/lesson1.js
```

### Import Multiple Lessons

```bash
# Using path from project root
node server/scripts/importCourseContent.js server/data/courseData.js

# Or using relative path
node server/scripts/importCourseContent.js ../data/courseData.js
```

### Default (if no file specified)

If you don't specify a file, it will try to import from `server/data/courseData.js`:

```bash
node server/scripts/importCourseContent.js
```

### Add to package.json

You can add scripts to your `package.json`:

```json
{
  "scripts": {
    "import-lesson": "node server/scripts/importCourseContent.js",
    "import-lesson1": "node server/scripts/importCourseContent.js server/data/lesson1.js",
    "import-lesson2": "node server/scripts/importCourseContent.js server/data/lesson2.js"
  }
}
```

Then run:

```bash
npm run import-lesson1
```

## Features

- ✅ Creates Content entries with `isCourseContent: true`
- ✅ Creates Lesson entries that reference the Content
- ✅ Skips existing lessons (by lessonNumber)
- ✅ Reuses existing content if it already exists (by title + isCourseContent)
- ✅ Provides detailed progress output
- ✅ Shows summary statistics after import

## Notes

- The script will skip lessons that already exist (based on `lessonNumber`)
- Content items are checked by `title` and `isCourseContent: true` to avoid duplicates
- All course content will be owned by the system/admin user
- Make sure your `.env` file has the correct `MONGO_URI` configured
- The import script will automatically find and use the system user (`system@palabrotas.com`) if it exists


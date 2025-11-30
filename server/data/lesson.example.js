// Example format for a single lesson
// Copy this file and rename it (e.g., lesson1.js, lesson2.js), then fill in your data

// Option 1: Export a single lesson object
export const lesson = {
  lessonNumber: 1,
  title: "Lesson 1: Greetings",
  description: "Learn basic Spanish greetings and introductions",
  vocabulary: [
    {
      title: "Hola",
      description: "Hello",
      hint: "Common greeting",
      exampleSentence: "Hola, ¿cómo estás?",
      country: "ES" // Optional, defaults to 'CO' if not provided
    },
    {
      title: "Buenos días",
      description: "Good morning",
      hint: "Used until noon",
      exampleSentence: "Buenos días, señor.",
      country: "ES"
    },
    {
      title: "Adiós",
      description: "Goodbye",
      hint: "Formal farewell",
      exampleSentence: "Adiós, hasta luego.",
      country: "ES"
    }
  ]
};

// Option 2: You can also export as an array with a single lesson
// export const courseData = [lesson];


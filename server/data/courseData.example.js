// Example format for course content data
// Copy this file and rename it to courseData.js, then fill in your actual data

export const courseData = [
  {
    lessonNumber: 1,
    title: "Lesson 1: Greetings",
    description: "Learn basic Spanish greetings and introductions",
    chatPrompt: "You are a friendly Spanish teacher helping a student practice greetings. Use the vocabulary: Hola, Buenos días, Adiós. Have a conversation about meeting someone new.",
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
  },
  {
    lessonNumber: 2,
    title: "Lesson 2: Numbers",
    description: "Learn numbers 1-10 in Spanish",
    chatPrompt: "You are a friendly Spanish teacher helping a student practice numbers. Use the vocabulary: Uno, Dos. Ask the student to count objects or practice using numbers in conversation.",
    vocabulary: [
      {
        title: "Uno",
        description: "One",
        hint: "First number",
        exampleSentence: "Tengo uno.",
        country: "ES"
      },
      {
        title: "Dos",
        description: "Two",
        hint: "Second number",
        exampleSentence: "Tengo dos.",
        country: "ES"
      }
    ]
  }
  // Add more lessons here...
];


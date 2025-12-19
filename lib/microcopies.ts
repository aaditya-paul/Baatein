/**
 * Caring, soft microcopies for various application states.
 * Designed to feel human and gentle.
 */

export const MICROCOPIES = {
  loading: [
    "Gently preparing your space...",
    "Taking a moment for you...",
    "Gathering your thoughts...",
    "Making things ready...",
    "A quiet moment while we load...",
    "Almost there, take a breath...",
    "Softly bringing your words back...",
    "Opening the quiet place...",
    "Sifting through the digital silence...",
    "Restoring your memories, slowly...",
    "Creating a calm corner for you...",
  ],
  saving: [
    "Safely tucking your thoughts away...",
    "Your words are held.",
    "Keeping this moment safe...",
    "All set, your thoughts are secure.",
    "Saved with care.",
    "Gently stored.",
    "Your reflection is now a part of the quiet.",
    "Holding onto these words for you.",
    "Sealing this moment in silence.",
    "Your heart is safe here.",
  ],
  deleting: [
    "Letting go of this moment...",
    "Space cleared.",
    "Gently removed.",
    "This space is now open again.",
    "Farewell to these words.",
    "Making room for new reflections.",
    "A gentle release.",
    "Washing away this page.",
    "The air is clear again.",
  ],
  error: [
    "Even the quietest places have jitters. Let's try again.",
    "Something went a bit sideways. Take a breath.",
    "We couldn't quite reach that. Maybe try once more?",
    "A small hiccup in the quiet. We're on it.",
    "Let's try that again, gently.",
    "The connection drifted for a moment.",
    "Peaceful persistence. Try one more time?",
    "Words sometimes get lost in the wind. Let's find them.",
  ],
  welcome: [
    "Welcome back to your quiet space",
    "It's good to see you again",
    "A moment for yourself awaits",
    "Ready when you are",
    "The silence has been waiting for you.",
    "Your thoughts are ready to be heard.",
    "Take a seat in the stillness.",
  ],
  prompts: [
    "What is one small thing that made you smile today?",
    "How does your body feel in this very moment?",
    "What is a sound you can hear right now?",
    "Write about a person who made you feel seen this week.",
    "What is a 'quiet win' you haven't celebrated yet?",
    "If today was a color, what would it be and why?",
    "What is something you're looking forward to tomorrow?",
    "Describe a place where you feel completely at peace.",
    "What is a lesson you learned from a difficult moment today?",
    "Write a short letter of gratitude to your future self.",
    "What is a thought that has been repeating in your mind?",
    "How have you been kind to yourself today?",
    "What is something you want to let go of before you sleep?",
    "Describe a smell that reminds you of home.",
    "What does 'enough' feel like to you right now?",
    "Who is someone you'd like to say 'thank you' to?",
    "What is a dream you remember, even if it's just a fragment?",
    "How has your perspective changed since this time last year?",
    "What is a question you've been avoiding asking yourself?",
    "Describe the texture of your current mood.",
    "What is a piece of advice you'd give to a younger version of you?",
    "What is something you're proud of, however small?",
  ],
};

/**
 * Returns a random microcopy for a given scenario.
 */
export function getRandomMicrocopy(scenario: keyof typeof MICROCOPIES): string {
  const options = MICROCOPIES[scenario];
  return options[Math.floor(Math.random() * options.length)];
}

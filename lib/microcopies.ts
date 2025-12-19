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
  ],
  saving: [
    "Safely tucking your thoughts away...",
    "Your words are held.",
    "Keeping this moment safe...",
    "All set, your thoughts are secure.",
    "Saved with care.",
    "Gently stored.",
  ],
  deleting: [
    "Letting go of this moment...",
    "Space cleared.",
    "Gently removed.",
    "This space is now open again.",
    "Farewell to these words.",
  ],
  error: [
    "Even the quietest places have jitters. Let's try again.",
    "Something went a bit sideways. Take a breath.",
    "We couldn't quite reach that. Maybe try once more?",
    "A small hiccup in the quiet. We're on it.",
    "Let's try that again, gently.",
  ],
  welcome: [
    "Welcome back to your quiet space",
    "It's good to see you again",
    "A moment for yourself awaits",
    "Ready when you are",
  ],
};

/**
 * Returns a random microcopy for a given scenario.
 */
export function getRandomMicrocopy(scenario: keyof typeof MICROCOPIES): string {
  const options = MICROCOPIES[scenario];
  return options[Math.floor(Math.random() * options.length)];
}

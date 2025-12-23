# AI Companion Feature

## Overview

The AI Companion is a gentle, non-intrusive presence that accompanies users as they write in their journal. Unlike traditional chatbots or therapy assistants, it doesn't interrupt thoughts or force conversation. Instead, it listens quietly in the background, offering subtle signals of presence and occasional gentle acknowledgments.

## Design Philosophy

The AI Companion follows Baatein's "Neutral to Emotion" design philosophy with these core principles:

### What It Is

- A quiet presence, like someone sitting beside you while you write
- A gentle listener that notices patterns and emotional weight
- A reflective mirror when explicitly asked
- Warm, human, and caring in tone

### What It Is NOT

- Not a chatbot that demands responses
- Not a therapist offering diagnoses or treatment
- Not an assistant trying to solve problems
- Not a conversation partner forcing back-and-forth
- Not intrusive or constantly interrupting

## User Experience

### Three Levels of Interaction

1. **Presence Mode** (Always visible when enabled)

   - Subtle animated indicator (emoji: ✨, 💙, 🤍, 🌙)
   - Shows the AI is listening without demanding attention
   - Pure presence, no text

2. **Acknowledgment Mode** (Triggered after natural pauses)

   - Very brief, 1-2 sentence recognition
   - Appears as a non-blocking overlay after meaningful writing and a 3-second pause
   - Examples: "That sounds like a lot to carry." or "I can feel the weight in those words."
   - Can be dismissed easily
   - More responsive with heavier emotional content

3. **Reflection Mode** (Offered after sustained writing, or on explicit request)
   - Full paragraph reflection (3-5 sentences)
   - Mirrors what it heard, notices patterns
   - Offered when content grows substantially between pauses
   - Appears only when user accepts the offer or explicitly asks
   - Streams in gradually to feel natural

### Interaction Flow

```
User starts writing
     ↓
User enables AI Companion (toggle in toolbar)
     ↓
Presence indicator appears (animated emoji)
     ↓
User continues writing (AI listens silently)
     ↓
[After meaningful writing + 3-second pause]
     ↓
AI offers gentle acknowledgment (dismissible)
     ↓
User continues writing
     ↓
[After sustained writing with multiple pauses]
     ↓
AI asks: "Would you like me to reflect?"
     ↓
User chooses: "Yes, please" or "Not now"
     ↓
[If yes] Full reflection streams in
```

## Technical Implementation

### Architecture

```
NewEntry Component (Client)
  ├─ AI State Management
  │  ├─ aiEnabled (toggle)
  │  ├─ aiPresence (emoji/signal)
  │  ├─ aiSuggestion (acknowledgment)
  │  └─ aiReflection (full reflection)
  │
  ├─ Typing Activity Detection
  │  ├─ Pause detection (3-second timer)
  │  ├─ Word count tracking
  │  └─ Emotional weight analysis
  │
  └─ API Integration
     └─ /api/ai/companion
        ├─ Presence mode (instant)
        ├─ Acknowledgment mode (Gemini 2.0)
        └─ Reflection mode (Gemini 2.0 streaming)
```

### Key Components

#### 1. State Management

```typescript
// AI Companion state
const [aiEnabled, setAiEnabled] = useState(false);
const [aiPresence, setAiPresence] = useState<string>("");
const [aiSuggestion, setAiSuggestion] = useState<string>("");
const [aiReflection, setAiReflection] = useState<string>("");
const [showReflectionOffer, setShowReflectionOffer] = useState(false);

// Typing activity tracking
const [lastWordCount, setLastWordCount] = useState(0);
const [typingPaused, setTypingPaused] = useState(false);
const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
const lastContentRef = useRef<string>("");
```

#### 2. Pause Detection

Uses a 3-second debounce timer that resets on each keystroke:

```typescript
const handleTypingActivity = () => {
  if (typingTimerRef.current) {
    clearTimeout(typingTimerRef.current);
  }

  typingTimerRef.current = setTimeout(() => {
    setTypingPaused(true);
    handlePauseDetected();
  }, 3000);
};
```

#### 3. Emotional Weight Analysis

Simple keyword-based analysis to adjust AI tone:

```typescript
const analyzeEmotionalWeight = (
  text: string
): "light" | "moderate" | "heavy" => {
  const heavyWords = [
    "anxious",
    "scared",
    "depressed",
    "hopeless",
    "alone",
    "can't",
    "struggling",
    "overwhelmed",
    "heavy",
    "tired",
  ];
  const count = heavyWords.filter((word) =>
    text.toLowerCase().includes(word)
  ).length;

  if (count >= 3) return "heavy";
  if (count >= 1) return "moderate";
  return "light";
};
```

### API Endpoint

**Route**: `/app/api/ai/companion/route.ts`

**Request Format**:

```typescript
{
  mode: "presence" | "acknowledgment" | "reflection",
  content: string,
  wordCount: number,
  emotionalWeight?: "light" | "moderate" | "heavy"
}
```

**Response Formats**:

- **Presence**: JSON with emoji/signal (no Gemini API call)
- **Acknowledgment**: Plain text response
- **Reflection**: Streaming text (chunked transfer encoding)

### System Prompts

Each mode has a carefully crafted system prompt that enforces:

1. **Presence Mode**: Single emoji or 2-4 word phrase only
2. **Acknowledgment Mode**: 1-2 sentences, warm recognition, no advice
3. **Reflection Mode**: 3-5 sentences, observing patterns, not directing

See [route.ts](app/api/ai/companion/route.ts) for full prompts.

## UI Components

### 1. Presence Indicator

- **Location**: Top-right corner
- **Appearance**: Animated emoji with pulse effect
- **Dismissal**: Fades out when AI is disabled

### 2. Acknowledgment Overlay

- **Location**: Bottom-center (above toolbar)
- **Style**: Glassmorphic card with backdrop blur
- **Dismissal**: Manual dismiss button

### 3. Reflection Offer

- **Location**: Bottom-center (above toolbar)
- **Style**: Glassmorphic card with two buttons
- **Options**: "Yes, please" or "Not now"

### 4. Reflection Panel

- **Location**: Bottom-center (above toolbar)
- **Style**: Larger glassmorphic card with Sparkles icon
- **Animation**: Text streams in gradually
- **Dismissal**: "Close" button

### 5. AI Toggle Button

- **Location**: Bottom toolbar (rightmost)
- **Icon**: Sparkles (Lucide)
- **States**:
  - Off: Gray icon
  - On: Purple icon with white/10 background
- **Tooltip**: "Enable/Disable AI Companion"

## Styling & Animation

All AI UI elements use:

- Framer Motion for smooth enter/exit animations
- Glassmorphic design (`bg-background/95 backdrop-blur-md`)
- Consistent border styling (`border border-white/10`)
- Shadow effects for depth (`shadow-xl`)
- AnimatePresence for mount/unmount transitions

## Configuration & Triggers

### Trigger Behavior

- **Acknowledgment**: Triggered after meaningful writing (20+ words) AND 3-second pause
  - More likely to trigger with heavier emotional content
  - Won't retrigger if already shown for current writing session
- **Reflection Offer**: Offered when content grows substantially (50+ words since last check)
  - Requires multiple pauses showing sustained engagement
  - Won't appear if acknowledgment or reflection already active

### Pause Duration

- **Default**: 3 seconds of no typing
- Configurable via `typingTimerRef` timeout value

### Emotional Keywords

Can be extended in `analyzeEmotionalWeight()` function:

```typescript
const heavyWords = [
  "anxious",
  "scared",
  "depressed",
  "hopeless",
  "alone",
  "can't",
  "struggling",
  "overwhelmed",
  "heavy",
  "tired",
  "exhausted",
];
```

## Privacy & Security

### End-to-End Encryption

- **AI responses ARE encrypted** before storage in the database
- User's journal content is encrypted before being sent to AI API
- AI interactions stored as encrypted JSONB in the `entries` table
- Each interaction includes: mode, response text, and timestamp
- All encryption uses the same DEK (Data Encryption Key) as journal content

### Data Flow

1. User writes → Client-side analysis (no network calls)
2. Pause detected → Content sent to `/api/ai/companion`
3. Gemini API processes → Response returned
4. Response displayed to user
5. **AI interaction stored in `aiInteractions` state array**
6. On save → AI interactions encrypted with DEK and stored in `entries.ai_interactions`
7. On load → AI interactions decrypted and restored

### Stored AI Interaction Format

```typescript
{
  mode: "acknowledgment" | "reflection",
  response: string,
  timestamp: string (ISO 8601)
}
```

**Note**: Presence mode signals are not stored (ephemeral only)

### User Preferences

- **AI Companion Toggle**: Stored in `profiles.preferences.aiCompanionEnabled`
- **Default**: Enabled by default for all users (`true`)
- **Persistence**: Preference is saved to database when toggled
- **Privacy**: Preference is per-user and respects their choice

## Future Enhancements

### Phase 1 (Current Implementation) ✅

- [x] Text-based AI companion
- [x] Three response modes
- [x] Pause detection
- [x] Emotional weight analysis
- [x] Toggle on/off
- [x] Encrypted storage of AI responses in database
- [x] User preference persistence
- [x] Enabled by default for all users

### Phase 2 (Planned)

- [ ] Improved emotional weight detection (sentiment analysis)
- [ ] Configurable sensitivity and frequency settings
- [ ] AI interaction history view within entries
- [ ] Analytics on AI usage patterns (privacy-respecting)

### Phase 3 (Future Vision)

- [ ] Multi-language support (Hindi, Hinglish)
- [ ] Voice input integration
- [ ] Voice emotion detection
- [ ] Text-to-speech for AI responses
- [ ] Crisis detection and resource suggestions

## Usage Examples

### Example 1: Light Acknowledgment

**User writes**:

> "Today was just an ordinary day. Work was fine, nothing special. Had lunch with a colleague. Weather was nice. Came home, watched some TV. Feeling okay, just a bit tired."

**AI Response** (after 3-second pause):

> "Sounds like a steady, quiet day. Sometimes those are just what we need."

---

### Example 2: Heavy Acknowledgment

**User writes**:

> "I can't shake this feeling. Everything feels heavy today. Woke up anxious, couldn't focus at work. Keep thinking about that conversation from yesterday. Feel like I'm drowning in my own thoughts. Can't tell if I'm overreacting or if this is real. Just want to feel normal again."

**AI Response** (after 3-second pause):

> "That sounds like a lot to carry. It's okay to sit with this for a bit."

---

### Example 3: Reflection Offer

**User continues writing** (sustained reflection with multiple pauses)

**AI Offers**:

> "Would you like me to reflect on what you've shared?"

**If user accepts** → Full paragraph reflection streams in:

> "I notice you keep returning to that conversation, like it's a thread you're trying to untangle. There's a pattern here—you're questioning whether your feelings are valid, wondering if you're 'too much.' But the heaviness you're describing isn't nothing. It's real, and it's asking to be acknowledged. You don't have to have it all figured out right now."

## Troubleshooting

### AI not responding

- Check `GEMINI_API_KEY` is set in `.env.local`
- Verify AI toggle is enabled (Sparkles button should be purple)
- Write at least 20+ words of meaningful content
- Wait for 3-second pause after typing
- Acknowledgment appears only once per writing session until dismissed

### Presence indicator not showing

- Toggle AI companion on using the Sparkles button
- Check browser console for errors
- Verify `/api/ai/companion` endpoint is accessible

### Streaming not working for reflections

- Ensure using Edge runtime in API route
- Check browser supports ReadableStream
- Verify Gemini API key has proper permissions

## API Limits & Rate Limiting

### Gemini API Free Tier

- **Requests per minute**: 15
- **Requests per day**: 1,500
- **Tokens per minute**: 1,000,000

### Baatein Usage Patterns

- **Presence mode**: No API calls (local only)
- **Acknowledgment**: 1 API call per writing session (typically)
- **Reflection**: 1 API call when user explicitly requests

**Estimated usage**: 2-3 API calls per journal entry (well within limits)

## Monitoring & Analytics

Currently no analytics are collected. Future considerations:

- Track AI enablement rate
- Monitor dismissal rates for acknowledgments
- Measure reflection acceptance rate
- Analyze pause patterns and triggers

## Credits

- **AI Model**: Google Gemini 2.0 Flash (Experimental)
- **Design**: Inspired by calm presence, not active assistance
- **Tone**: Informed by non-violent communication and trauma-informed care practices
- **Implementation**: Built with Next.js 15, TipTap editor, and Framer Motion

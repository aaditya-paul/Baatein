# AI Companion Modes Guide

## Overview

The AI Companion in Baatein offers three distinct interaction modes, each designed for different writing experiences and levels of engagement. All AI responses are encrypted end-to-end and stored securely in the database.

## Three Modes

### 1. Minimal Mode (Quiet Presence)

**Best for**: Focused writing with subtle AI support

- **Behavior**: Non-intrusive presence with gentle acknowledgments
- **UI**: Modal overlays that appear briefly and can be dismissed
- **Response Length**: 2-3 lines maximum
- **Triggers**:
  - Presence signal (emoji/short phrase) appears when AI is enabled
  - Acknowledgment after 3-second pause (minimum 20 words)
  - Optional reflection offer based on emotional weight
- **User Control**: Easy dismiss on all modals

**Use Case**: You want to write without distractions but appreciate occasional gentle acknowledgment of your thoughts.

### 2. Embedded Mode (Woven Thoughts)

**Best for**: Writers who want AI responses visible in context

- **Behavior**: AI messages appear as colored boxes directly in the editor
- **UI**: Purple/blue gradient boxes below your writing
- **Response Length**: 2-3 lines (same as minimal)
- **Features**:
  - **Remove Button**: Dismiss any AI message you don't want to keep
  - **Continue in Chat Button**: Opens full chat sidebar with this message as context
  - Messages stay visible until you remove them
  - Multiple messages can stack
- **Triggers**: Same pause detection as minimal mode

**Use Case**: You want AI responses to be part of your journal, visible alongside your writing, with the option to expand into full conversation.

### 3. Chat Mode (Heart to Heart)

**Best for**: Deep reflection and extended conversation

- **Behavior**: Full sidebar chat interface
- **UI**: Sliding sidebar panel (right side on desktop, full-screen on mobile)
- **Response Length**: No limit - full conversational responses
- **Features**:
  - Full conversation history
  - Message bubbles for user and AI
  - Real-time message sending
  - Entry context available to AI
  - Typing indicators
  - Persistent across mode switches
- **Chat Button**: Appears in toolbar when chat mode is active

**Use Case**: You want to have a deeper conversation about what you've written, explore your thoughts more thoroughly, or get extended reflection.

## Mode Selection

### How to Switch Modes

1. Enable AI Companion (Sparkles icon ✨ in toolbar)
2. Select mode from dropdown in toolbar:
   - Labels are randomized microcopies (e.g., "Quiet presence", "Woven thoughts", "Heart to heart")
3. Mode preference is saved automatically

### Mode Transitions

- **Minimal → Embedded**: Previous modal messages don't carry over
- **Minimal → Chat**: Opens chat sidebar, previous interactions available in history
- **Embedded → Chat**: Click "Continue in Chat" on any embedded message to switch modes and carry that message into conversation
- **Chat → Embedded/Minimal**: Chat history is preserved if you switch back

## Technical Details

### Pause Detection

- **Trigger**: 3-second pause in typing
- **Minimum Words**: 20 words before AI responds
- **Emotional Weight Analysis**: AI adjusts tone based on detected emotional weight (light/moderate/heavy)

### Response Modes

The AI operates in 4 internal modes (mapped to the 3 user-facing modes):

1. **Presence**: Quick emoji/short phrase (no API call)
2. **Acknowledgment**: 2-3 line gentle response (used in minimal & embedded)
3. **Reflection**: Deeper 2-3 line reflection offered after emotional content
4. **Chat**: Full conversational responses with history

### Data Storage

- All AI interactions stored in `ai_interactions` jsonb column
- Encrypted with same DEK as journal entry content
- Includes mode, response, and timestamp
- Embedded messages and chat history also encrypted

### API Endpoint

`POST /api/ai/companion`

**Payload**:

```json
{
  "mode": "presence" | "acknowledgment" | "reflection" | "chat",
  "content": "user's journal text",
  "wordCount": 125,
  "emotionalWeight": "moderate",
  "chatHistory": [...],  // for chat mode
  "userMessage": "..."    // for chat mode
}
```

## Responsive Design

### Mobile (< 640px)

- Mode selector text remains visible
- Chat sidebar takes full screen width
- Embedded messages full width
- Button labels may be hidden (icons only)

### Tablet (640px - 1024px)

- Chat sidebar: 24rem width
- All features visible
- Optimized touch targets

### Desktop (> 1024px)

- Chat sidebar: 28rem width
- Full feature set with labels
- Optimal reading experience

## Microcopies

All mode names, button labels, and actions use randomized microcopies from `lib/microcopies.ts`:

### Mode Labels

- **Minimal**: "Quiet presence", "Soft echoes", "Gentle whispers", "Subtle companion", "Light touch"
- **Embedded**: "Woven thoughts", "Threaded reflections", "Intertwined words", "Nested presence", "Living notes"
- **Chat**: "Open conversation", "Side by side", "Full dialogue", "Deep talk", "Heart to heart"

### Action Labels

- **Continue Chat**: "Keep talking", "Continue here", "Say more", "Open up", "Let's talk"
- **Remove**: "Let go", "Clear this", "Release", "Fade away", "Dismiss"

These are randomized on component mount to add warmth and variety.

## AI Personality

The AI companion maintains a consistent, warm personality across all modes:

- **Not a therapist**: Listening friend, not clinical
- **Validating**: Acknowledges feelings without judgment
- **Gentle**: Soft reflections, never pushy
- **Brief** (in minimal/embedded): Respects the user's space
- **Present**: Available but not intrusive

## Privacy & Security

- ✅ All AI responses encrypted end-to-end (AES-256-GCM)
- ✅ Same encryption key as journal entries
- ✅ No AI data sent to third parties beyond Google Gemini API
- ✅ Mode preference stored encrypted in user profile
- ✅ Chat history encrypted in session and database
- ✅ Users can disable AI completely at any time

## Tips for Users

1. **Try All Modes**: Each offers a different experience - experiment to find what works for your current state
2. **Switch Modes Mid-Entry**: You're not locked in - switch as your needs change
3. **Use Embedded for Reference**: Keep certain AI responses visible while you continue writing
4. **Deep Dive in Chat**: When you need to explore something more, switch to chat mode
5. **Disable When Needed**: Sometimes you need pure silence - toggle AI off completely

## Future Enhancements

Potential additions (not yet implemented):

- [ ] Voice input for chat mode
- [ ] AI-suggested prompts when you're stuck
- [ ] Mood tracking integration
- [ ] Export chat transcripts
- [ ] Custom AI personality settings
- [ ] Multiple AI voices/personas

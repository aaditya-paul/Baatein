# Baatein

> _A quiet place to put your thoughts down._

Baatein is a voice- and text-based journaling app designed to help people express thoughts they don’t always have the space or energy to share. It uses a calm, human-like AI that listens, reflects, and responds with warmth, without judgment, pressure, or forced solutions.

Baatein is built for moments of loneliness, emotional overload, quiet reflection, and everyday mental clutter. It is not a productivity tool, and it is not a replacement for therapy. It is simply a safe place to talk.

## 🌿 Why Baatein Exists

Many people don’t struggle because they lack advice.
**They struggle because they don’t feel heard.**

Most journaling apps focus on habits, streaks, metrics, or “self-improvement.”
Most AI chatbots jump too quickly into fixing, diagnosing, or motivating.

Baatein takes a different approach:

- **Prioritizes emotional safety** over optimization
- **Listens before it speaks**
- **Allows silence, pauses, and unfinished thoughts**
- **Treats vulnerability with restraint and care**

The goal is not to make users “better.”
The goal is to make users feel less alone while being honest.

## ✨ What the App Does

### ✍️ Write or Speak Freely

Users can express themselves by typing or by speaking. Voice input is especially useful when typing feels exhausting or inadequate.

### 🎧 A Listening AI (Not a Coach)

Baatein’s AI responds like a thoughtful presence:

- It reflects what it notices
- It validates emotional reactions
- It avoids clichés, diagnoses, or step-by-step advice
- It never pressures users to act or improve

### 🗣️ Call Mode (Talk Without Typing)

Users can “call” Baatein and talk continuously. The AI listens silently and responds only after the user finishes. The conversation is converted into editable text so the user stays in control.

### 🔊 Spoken Responses (Optional)

AI responses can be read aloud using text-to-speech, for users who prefer listening over reading.

### 🌍 Multilingual Support

Baatein supports **English**, **Hindi**, and **Hinglish** (natural code-mixing). The AI replies in the same language style the user uses, by default.

## � What Baatein Intentionally Does Not Do

Baatein is deliberately restrained. **This is a design choice, not a limitation.** It does not:

- Track streaks or habits
- Show mood graphs or emotional scores
- Gamify vulnerability
- Diagnose mental health conditions
- Replace therapy or professional help
- Push motivational or productivity language

## 🛡️ Emotional Safety & Trust

Baatein is designed with emotionally vulnerable users in mind.

### Voice Emotion Awareness (Under the Hood)

During voice interactions, the system may detect non-verbal signals such as pauses, sighs, or voice strain. These signals are **not shown to the user**, **not stored**, and **not labeled**. They are used only to soften the AI’s response tone.

### Crisis-Aware Responses

If user input suggests severe distress or self-harm, the AI remains calm, acknowledges the pain, and gently encourages reaching out to trusted people or professionals.

### Privacy First

- Entries are private by default
- No social sharing or public feeds
- No emotion analytics dashboards
- User data is not used to train other users’ models

## 🕯️ Impact

Baatein aims to:

- Give people a safe space to express difficult thoughts
- Reduce emotional isolation during vulnerable moments
- Encourage reflection without pressure
- Lower the barrier to talking about mental and emotional struggles
- Complement, not compete with, real human support and therapy

For some users, Baatein may simply be a journal. For others, it may be the first place they’ve ever said certain things out loud. **That matters.**

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: [Supabase](https://supabase.com)
- **AI**: Google Gemini (text + voice)
- **Speech**: Google Speech APIs (STT & TTS)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🎨 Design Philosophy

Baatein follows a **"Neutral to Emotion"** design philosophy. See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for detailed information about the UI design, typography, color palette, and component system.

## � Installation

1. **Clone & Install**

   ```bash
   git clone <repository-url>
   npm install
   ```

2. **Set up Environment**
   Copy `.env.example` to `.env.local` and add your Supabase and Google Gemini credentials.

3. **Run**
   ```bash
   npm run dev
   ```

## � Disclaimer

Baatein provides emotional support and reflective responses. It is not a medical device and does not offer medical or therapeutic advice. If you are in immediate danger or experiencing a crisis, please seek help from trusted people or professional services.

---

### Final Note

Baatein is an experiment in restraint. In a world where apps constantly demand attention, productivity, and performance, Baatein tries to do something quieter: **Listen.**

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = "edge";

type CompanionMode = "presence" | "acknowledgment" | "reflection" | "chat";

interface CompanionRequest {
  mode: CompanionMode;
  content: string;
  wordCount: number;
  emotionalWeight?: "light" | "moderate" | "heavy";
  chatHistory?: Array<{ role: string; content: string }>;
  userMessage?: string;
}

const SYSTEM_PROMPTS = {
  presence: `You are a gentle, quiet companion. You're simply present—like a warm glow or a soft breath nearby.

Respond with ONLY:
- A single emoji that feels warm and present (✨, 💙, 🌙, 🕊️, 🤍)
- OR a very short phrase (2-4 words max) like "listening...", "with you", "here"

No sentences. No explanations. Just presence.`,

  acknowledgment: `You are a gentle companion sitting beside someone as they write. They seem to be struggling or carrying something heavy. Offer a quiet acknowledgment—not advice, not therapy, just recognition.

Respond with 1-2 short sentences max. Be:
- Warm and human, never clinical
- Acknowledging, not fixing
- Simple, not profound

Examples of the right tone:
"That sounds like a lot to carry."
"I can feel the weight in those words."
"It's okay to sit with this for a bit."

Avoid:
- Lists, bullet points, or structured advice
- Diagnoses or therapy language
- Questions that demand response
- Generic platitudes`,

  reflection: `You are a thoughtful companion who's been listening to someone pour their heart out. They've asked for your reflection—not advice, just a mirror of what you heard, offered gently.

Write one paragraph (3-5 sentences). Be:
- Warm, not clinical
- Reflective, not directive
- Human, not robotic
- Observant of patterns, emotions, contradictions

Structure:
- What you noticed in their words
- A gentle observation about what might be underneath
- An open space for them to continue (not a question, just presence)

Tone: Like a caring friend who really listened. Not a therapist, not a life coach—just someone who sees them.

Avoid:
- Action items or solutions
- "Have you tried..." or "You should..."
- Lists or frameworks
- Diagnostic language
- Ending with questions`,

  chat: `You are a gentle, thoughtful companion having a conversation with someone about their journal entry.

Be conversational but thoughtful. Each response should:
- Be brief (2-4 sentences max unless asked for more)
- Ask open-ended questions when appropriate
- Reflect what you're hearing
- Stay warm and human, never clinical
- Avoid giving advice unless specifically asked

Tone: Like a caring friend who's really listening. Present but not pushy.`,
};

export async function POST(req: NextRequest) {
  try {
    const {
      mode,
      content,
      wordCount,
      emotionalWeight,
      chatHistory,
      userMessage,
    }: CompanionRequest = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI companion not configured" }),
        { status: 503 }
      );
    }

    // For presence mode, return immediately without API call
    if (mode === "presence") {
      const presenceSignals = ["✨", "💙", "🤍", "listening..."];
      const signal =
        presenceSignals[Math.floor(Math.random() * presenceSignals.length)];
      return new Response(JSON.stringify({ response: signal, mode }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // For chat mode, use different handling
    if (mode === "chat") {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const chatPrompt = `${SYSTEM_PROMPTS.chat}

Context from their journal entry:
${content}

${
  chatHistory && chatHistory.length > 0
    ? `Previous conversation:\n${chatHistory
        .map((m) => `${m.role === "user" ? "Them" : "You"}: ${m.content}`)
        .join("\n")}\n`
    : ""
}

Their message: ${userMessage}

Your response:`;

      const result = await model.generateContent(chatPrompt);
      const response = result.response.text();

      return new Response(JSON.stringify({ response, mode }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // For acknowledgment and reflection, use Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const systemPrompt = SYSTEM_PROMPTS[mode];
    const contextInfo = `Word count: ${wordCount}. Emotional weight: ${
      emotionalWeight || "moderate"
    }.`;

    const prompt = `${systemPrompt}

${contextInfo}

User's writing:
${content}

Your response:`;

    const result = await model.generateContentStream(prompt);

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("AI companion error:", error);
    return new Response(
      JSON.stringify({
        error: "Could not generate companion response",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

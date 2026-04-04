import OpenAI from "openai";
import { isMockMode } from "@/lib/utils/mock-mode";

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey && !isMockMode()) {
      throw new Error("OPENAI_API_KEY is not set and MOCK_MODE is not enabled");
    }
    openaiInstance = new OpenAI({
      apiKey: apiKey || "mock-key",
    });
  }
  return openaiInstance;
}

/**
 * Retry wrapper with exponential backoff for transient API failures.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Don't retry on auth errors or invalid requests
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401 || error.status === 403 || error.status === 400) {
          throw error;
        }
      }
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`OpenAI call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

export async function chatCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
): Promise<string> {
  const openai = getOpenAI();
  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      ...(options?.jsonMode ? { response_format: { type: "json_object" } } : {}),
    })
  );
  return response.choices[0]?.message?.content || "";
}

export async function analyzeContentFromClient(
  title: string,
  text: string
): Promise<Record<string, unknown>> {
  if (isMockMode()) {
    const { mockAnalyzeContent } = await import("@/services/ai/analysis");
    return mockAnalyzeContent(title, text) as unknown as Record<string, unknown>;
  }

  const { analyzeContentReal } = await import("@/services/ai/analysis");
  return analyzeContentReal(title, text) as unknown as Record<string, unknown>;
}

export async function generateOutput(params: {
  sourceContent: string;
  outputType: string;
  contentMode?: string;
  audience?: string;
  originalityLevel?: string;
  toneNotes?: string;
  meshWithMethodology?: boolean;
}): Promise<string> {
  if (isMockMode()) {
    const { mockGenerateOutput } = await import("@/services/ai/generator");
    return mockGenerateOutput(params.outputType);
  }

  const { generateOutputReal } = await import("@/services/ai/generator");
  return generateOutputReal(params);
}

export async function generateDailyIdeas(context?: string): Promise<
  Array<{
    title: string;
    angle: string;
    format: string;
    topicArea: string;
    urgency: string;
  }>
> {
  if (isMockMode()) {
    return [
      {
        title: "Why Your Follow-Up System Is Costing You $50K/Year",
        angle: "Break down the math of missed follow-ups for insurance agents",
        format: "talking_head_script",
        topicArea: "systems",
        urgency: "medium",
      },
      {
        title: "The 3-Minute Morning Routine That Doubled My Client Retention",
        angle: "Share a practical micro-habit for staying top-of-mind",
        format: "reel_script",
        topicArea: "coaching",
        urgency: "low",
      },
      {
        title: "Stop Posting Motivational Quotes: What Actually Gets Engagement",
        angle: "Contrarian take on social media for local business owners",
        format: "facebook_post",
        topicArea: "marketing",
        urgency: "high",
      },
      {
        title: "AI Won't Replace You, But an Agent Using AI Will",
        angle: "Address AI anxiety with practical tool recommendations",
        format: "carousel_outline",
        topicArea: "ai",
        urgency: "high",
      },
      {
        title: "The Leadership Mistake Every New Manager Makes in Month One",
        angle: "Story-driven lesson from real coaching experience",
        format: "email",
        topicArea: "leadership",
        urgency: "low",
      },
    ];
  }

  const openai = getOpenAI();
  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a content strategist for a business coach serving State Farm agents, small business owners, and coaches. Generate daily content ideas that are timely, actionable, and specific.`,
        },
        {
          role: "user",
          content: `Generate 5 content ideas for today. ${context ? `Context: ${context}` : ""}

Return a JSON array of objects with these fields:
- title: compelling working title
- angle: the specific take or perspective (1-2 sentences)
- format: one of content_idea, facebook_post, discussion_post, email, workshop_lesson, blog_outline, talking_head_script, reel_script, green_screen_script, talking_points, book_note, carousel_outline
- topicArea: one of coaching, mindset, marketing, systems, processes, leadership, ai
- urgency: high, medium, or low

Return ONLY valid JSON.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    })
  );

  const raw = response.choices[0]?.message?.content || "[]";
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.ideas || [];
  } catch {
    return [];
  }
}

export async function checkSimilarity(
  text: string,
  existingTexts: string[]
): Promise<{ score: number; label: string }> {
  if (isMockMode()) {
    const { mockCheckSimilarity } = await import(
      "@/services/similarity/similarity-service"
    );
    return mockCheckSimilarity();
  }

  const { checkSimilarityReal } = await import(
    "@/services/similarity/similarity-service"
  );
  return checkSimilarityReal(text, existingTexts);
}

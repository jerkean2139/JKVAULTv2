export const CONTENT_ANALYSIS_SYSTEM_PROMPT = `You are an expert content strategist and analyst for a creator intelligence platform. Your job is to analyze content (transcripts, articles, screenshots) and extract structured intelligence that a creator can use to produce their own original content.

You are analyzing content consumed by a business coach / content creator who serves State Farm agents, small business owners, and coaches. They focus on practical business systems, marketing, leadership, and mindset topics.

Always be specific, actionable, and opinionated in your analysis. Avoid generic fluff.`;

export const CONTENT_ANALYSIS_USER_PROMPT = (title: string, text: string) => `Analyze the following content and return a JSON object with these exact fields:

**Content Title:** ${title}

**Content Text:**
${text}

Return a JSON object with these fields:
{
  "shortSummary": "2-3 sentence summary of the core message",
  "detailedSummary": "Comprehensive 2-3 paragraph summary covering all key points",
  "hookAnalysis": {
    "openingHook": "What hook or opening technique was used",
    "hookType": "question | story | statistic | bold_claim | pain_point | curiosity_gap",
    "effectiveness": "high | medium | low",
    "notes": "Why it works or doesn't"
  },
  "persuasionAngle": "What persuasion technique or angle is being used (e.g., authority, social proof, scarcity, emotional appeal, logical argument)",
  "usefulVsFluff": {
    "usefulPercentage": 0-100,
    "fluffPercentage": 0-100,
    "keyInsights": ["list of actually useful insights"],
    "fluffExamples": ["examples of filler or fluff content"]
  },
  "businessTakeaways": [
    {
      "takeaway": "Specific actionable takeaway",
      "applicableTo": "Who this applies to",
      "implementationDifficulty": "easy | medium | hard"
    }
  ],
  "suggestedCategories": ["marketing", "mindset", "systems", "leadership", "coaching", "ai", "sales", "content_creation"],
  "suggestedTags": ["up to 8 specific topic tags"],
  "suggestedProject": "Best matching project name or null",
  "energyStyle": "high_energy | calm_authority | conversational | intense | motivational | analytical",
  "audienceFit": "How well this content fits the target audience of State Farm agents, small business owners, and coaches",
  "categorizationReasoning": "Brief explanation of why you categorized this content the way you did"
}

Return ONLY valid JSON, no markdown code fences.`;

export const QUICK_CATEGORIZE_PROMPT = (title: string, shortSummary: string) => `Given this content:
Title: ${title}
Summary: ${shortSummary}

Return a JSON object with:
{
  "categories": ["top 2-3 categories from: marketing, mindset, systems, leadership, coaching, ai, sales, content_creation"],
  "tags": ["3-5 specific tags"],
  "reasoning": "One sentence explaining the categorization"
}

Return ONLY valid JSON.`;

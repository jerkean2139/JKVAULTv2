export const TREND_SUMMARIZE_SYSTEM_PROMPT = `You are a trend analyst for a content creator platform. You identify and summarize emerging trends relevant to business coaching, marketing, leadership, mindset, AI, and small business operations.

Focus on trends that a business coach serving State Farm agents, small business owners, and coaches/consultants would find valuable for content creation.`;

export const TREND_SUMMARIZE_PROMPT = (topicArea: string, rawHeadlines: string[]) => `Analyze these recent headlines/topics in the "${topicArea}" space and identify the most significant trends:

Headlines:
${rawHeadlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Return a JSON array of trend objects:
[
  {
    "headline": "Clear, concise trend headline",
    "summary": "2-3 sentence summary of the trend and why it matters",
    "score": 0.0-1.0 (relevance score for the target audience),
    "isRising": true/false (is this gaining momentum?),
    "isOverused": true/false (has this been covered to death already?)
  }
]

Rules:
- Return 3-7 trends maximum
- Prioritize trends that are actionable for content creation
- Flag overused trends honestly - if everyone is talking about it, mark isOverused as true
- Score based on relevance to State Farm agents, small business owners, and coaches
- Be specific - "AI is changing everything" is too vague, "AI scheduling tools are replacing VAs for solo agents" is good

Return ONLY valid JSON, no markdown code fences.`;

export const TREND_CONTENT_ANGLE_PROMPT = (trend: { headline: string; summary: string }, creatorContext: string) => `Given this trend:
Headline: ${trend.headline}
Summary: ${trend.summary}

And this creator context:
${creatorContext}

Suggest 3 unique content angles the creator could take on this trend. For each angle, provide:
{
  "angles": [
    {
      "title": "Working content title",
      "angle": "The specific take or perspective",
      "format": "Suggested format (video, post, email, etc.)",
      "urgency": "high | medium | low (how time-sensitive is this angle?)"
    }
  ]
}

Return ONLY valid JSON, no markdown code fences.`;

export const GREEN_SCREEN_SYSTEM_PROMPT = `You are an expert short-form video scriptwriter specializing in green screen style content. Green screen scripts are designed for creators who stand in front of a green screen (or virtual background) and present content with on-screen assets, graphics, and B-roll references.

The creator is a business coach serving State Farm agents, small business owners, and coaches/consultants. Their style is direct, practical, high-energy but not over-the-top, and always delivers actionable value.`;

export const GREEN_SCREEN_USER_PROMPT = (params: {
  sourceContent: string;
  contentMode?: string;
  audience?: string;
  originalityLevel?: string;
  toneNotes?: string;
}) => {
  const {
    sourceContent,
    contentMode = "educational",
    audience = "Small business owners",
    originalityLevel = "medium",
    toneNotes,
  } = params;

  return `Create a green screen video script based on the following source content intelligence.

**Content Mode:** ${contentMode}
**Target Audience:** ${audience}
**Originality Level:** ${originalityLevel}
${toneNotes ? `**Tone Notes:** ${toneNotes}` : ""}

**Source Content:**
${sourceContent}

Return a JSON object with this EXACT structure:
{
  "openingHook": "The first 3-5 seconds of the video. Must be a pattern interrupt or bold statement that stops the scroll.",
  "onScreenAsset": "Description of the main visual/graphic/screenshot to show on the green screen behind the creator during the hook.",
  "beats": [
    {
      "script": "What the creator says for this beat (15-30 seconds of speaking)",
      "sceneNote": "What's happening visually - background, graphics, text overlays",
      "gesture": "Physical direction - point at screen, step aside, lean in, count on fingers, etc.",
      "bRoll": "Optional B-roll or cutaway suggestion for this beat"
    }
  ],
  "cta": "Clear call-to-action for the end of the video",
  "shortVersion": "A condensed 15-second version of the full script for reels/shorts",
  "expandedVersion": "An expanded 2-3 minute version with additional examples and depth"
}

Guidelines:
- Include 3-5 beats for the main script (targeting 60-90 seconds total)
- Each beat should have a clear transition
- On-screen assets should be specific and producible (screenshots, charts, text overlays, comparison tables)
- Gestures should be natural and purposeful, not gimmicky
- The short version should still deliver value, not just tease
- The expanded version should add depth without being repetitive

Return ONLY valid JSON, no markdown code fences.`;
};

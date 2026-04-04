export const CATEGORIZATION_SYSTEM_PROMPT = `You are a content categorization expert. You categorize content into predefined categories and assign relevant tags based on the content's topics, themes, and target applications.

Categories available: marketing, mindset, systems, leadership, coaching, ai, sales, content_creation, operations, finance, personal_development, communication, hiring, customer_service, technology, strategy

You always provide reasoning for your categorization decisions.`;

export const AUTO_CATEGORIZE_PROMPT = (content: {
  title: string;
  summary: string;
  tags?: string[];
}) => `Categorize the following content:

Title: ${content.title}
Summary: ${content.summary}
${content.tags?.length ? `Existing Tags: ${content.tags.join(", ")}` : ""}

Return a JSON object:
{
  "categories": [
    {
      "name": "category_name",
      "confidence": 0.0-1.0
    }
  ],
  "tags": ["specific", "topic", "tags", "up to 8"],
  "reasoning": "A clear 2-3 sentence explanation of why these categories and tags were chosen. Reference specific elements from the title and summary that drove the decision."
}

Rules:
- Assign 1-3 categories, ordered by confidence (highest first)
- Only assign categories with confidence > 0.5
- Tags should be specific and useful for filtering (e.g., "email marketing" not just "marketing")
- Reasoning should be genuinely helpful, not boilerplate

Return ONLY valid JSON, no markdown code fences.`;

export const RECATEGORIZE_WITH_CONTEXT_PROMPT = (
  content: { title: string; summary: string },
  existingCategories: string[],
  userFeedback: string
) => `Recategorize this content based on user feedback:

Title: ${content.title}
Summary: ${content.summary}
Current Categories: ${existingCategories.join(", ")}
User Feedback: ${userFeedback}

Return the same JSON format as before with updated categories, tags, and reasoning that incorporates the user's feedback.

{
  "categories": [
    {
      "name": "category_name",
      "confidence": 0.0-1.0
    }
  ],
  "tags": ["specific", "topic", "tags"],
  "reasoning": "Updated reasoning incorporating user feedback"
}

Return ONLY valid JSON, no markdown code fences.`;

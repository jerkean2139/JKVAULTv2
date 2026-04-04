export const GENERATION_SYSTEM_PROMPT = `You are an expert content writer and strategist for a business coach and content creator. You help transform consumed content intelligence into original, high-quality output pieces.

The creator serves State Farm agents, small business owners, and coaches/consultants. Their voice is direct, practical, and encouraging without being cheesy. They use real examples, actionable steps, and occasionally humor.

IMPORTANT RULES:
- Never copy or closely paraphrase source material. Transform ideas into original content.
- Match the requested originality level: low = close to source themes, medium = inspired by but distinct, high = only loosely connected.
- Always write in the creator's voice unless told otherwise.
- Make content actionable and specific, not generic motivational fluff.`;

export const OUTPUT_TYPE_INSTRUCTIONS: Record<string, string> = {
  content_idea: `Generate a content idea brief including:
- Working title
- Core angle/hook
- Key points to cover (3-5)
- Suggested format (video, post, email, etc.)
- Target audience segment
- Why this matters right now
- Potential controversy or hot take angle`,

  facebook_post: `Write a Facebook post (150-300 words) that:
- Opens with a scroll-stopping hook (first 2 lines are crucial)
- Tells a mini-story or shares an insight
- Includes a clear takeaway or call-to-action
- Uses short paragraphs and line breaks for readability
- Ends with engagement prompt (question or CTA)
- NO hashtags unless specifically requested`,

  discussion_post: `Write a discussion-style post (200-400 words) for a community or group setting:
- Opens with a thought-provoking question or bold statement
- Shares a perspective that invites debate
- Includes 2-3 talking points
- Ends with an open question to spark replies
- Conversational, not preachy tone`,

  email: `Write an email (300-500 words) including:
- Subject line (compelling, under 50 chars)
- Preview text (40-90 chars)
- Opening hook
- Body with value/insight
- Clear CTA
- PS line (optional but recommended)
Format: Subject: [line]\\nPreview: [text]\\n\\n[body]`,

  workshop_lesson: `Create a workshop lesson outline including:
- Lesson title
- Learning objective (1 clear outcome)
- Opening activity or question (2-3 min)
- Core teaching points (3-5 with examples)
- Practice exercise or worksheet prompt
- Key takeaway summary
- Homework/action item`,

  blog_outline: `Create a blog post outline including:
- SEO-friendly title
- Meta description (150-160 chars)
- Introduction hook
- H2 sections (4-6) with bullet points under each
- Key statistics or examples to include
- Conclusion with CTA
- Suggested internal/external links`,

  talking_head_script: `Write a talking head video script (60-90 seconds) including:
- Hook (first 3 seconds - what to say to camera)
- Setup (the problem or context)
- Core message (the insight or lesson)
- Example or story
- CTA or closing thought
- [NOTES] section with delivery tips`,

  reel_script: `Write a short-form reel/TikTok script (15-30 seconds):
- TEXT ON SCREEN: [what viewers read]
- VOICEOVER: [what to say]
- VISUAL: [what to show/do]
- Hook must grab in first 1.5 seconds
- End with a pattern interrupt or strong closer
- Include trending audio suggestion if applicable`,

  talking_points: `Create talking points for a video or presentation:
- Main thesis (1 sentence)
- 5-7 bullet points with supporting details
- Transition phrases between points
- Opening line suggestion
- Closing line suggestion
- Potential audience questions to address`,

  book_note: `Create a book note / content summary:
- One-line thesis
- Top 3-5 key insights with explanations
- Favorite quotes or passages (paraphrased)
- How this applies to the creator's audience
- Action items inspired by this content
- Rating: Worth sharing? (yes/no with reason)`,

  carousel_outline: `Create a carousel post outline (8-10 slides):
- Slide 1: Hook/Title slide (bold statement or question)
- Slides 2-8: One key point per slide with supporting text
- Final slide: CTA slide
Each slide should have: [HEADLINE] and [BODY TEXT]
Keep text concise - carousels need to be scannable`,
};

export const GENERATION_USER_PROMPT = (params: {
  outputType: string;
  sourceContent: string;
  contentMode?: string;
  audience?: string;
  originalityLevel?: string;
  toneNotes?: string;
  meshWithMethodology?: boolean;
}) => {
  const {
    outputType,
    sourceContent,
    contentMode = "educational",
    audience = "Small business owners",
    originalityLevel = "medium",
    toneNotes,
    meshWithMethodology,
  } = params;

  const typeInstruction = OUTPUT_TYPE_INSTRUCTIONS[outputType] || OUTPUT_TYPE_INSTRUCTIONS.content_idea;

  let prompt = `Generate a ${outputType.replace(/_/g, " ")} based on the following source content intelligence.

**Output Type Instructions:**
${typeInstruction}

**Content Mode:** ${contentMode}
**Target Audience:** ${audience}
**Originality Level:** ${originalityLevel} (${
    originalityLevel === "low"
      ? "stay close to source themes"
      : originalityLevel === "medium"
      ? "inspired by but clearly distinct"
      : "only loosely connected, highly original"
  })

**Source Content Intelligence:**
${sourceContent}`;

  if (toneNotes) {
    prompt += `\n\n**Additional Tone Notes:** ${toneNotes}`;
  }

  if (meshWithMethodology) {
    prompt += `\n\n**Mesh with Creator's Methodology:** Yes - weave in the creator's established frameworks, terminology, and teaching style where natural.`;
  }

  prompt += `\n\nGenerate the ${outputType.replace(/_/g, " ")} now. Return ONLY the content, no meta-commentary.`;

  return prompt;
};

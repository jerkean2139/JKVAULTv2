import { z } from "zod";

// ============= Content =============

export const processContentSchema = z.object({
  sourceType: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  title: z.string().max(500).optional(),
  rawText: z.string().max(100000).optional(),
  screenshotText: z.string().max(100000).optional(),
}).refine(
  (data) => data.sourceUrl || data.rawText || data.screenshotText,
  { message: "At least one of sourceUrl, rawText, or screenshotText is required" }
);

export const updateContentSchema = z.object({
  status: z.enum(["draft", "reviewed", "favorite", "needs_rewrite", "ready_to_record", "archived"]).optional(),
  title: z.string().min(1).max(500).optional(),
  projectId: z.string().cuid().nullable().optional(),
  savedCreatorId: z.string().cuid().nullable().optional(),
  transcriptText: z.string().max(200000).optional(),
  needsTranscript: z.boolean().optional(),
  targetPublishDate: z.string().datetime().nullable().optional(),
  targetPlatform: z.string().max(100).nullable().optional(),
}).strict();

export const createContentSchema = z.object({
  sourceType: z.enum(["youtube", "youtube_short", "screenshot_set", "manual_text", "user_content", "other"]).default("manual_text"),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  title: z.string().min(1).max(500).default("Untitled"),
  creatorNameRaw: z.string().max(200).optional(),
  rawText: z.string().max(200000).optional(),
  transcriptText: z.string().max(200000).optional(),
  status: z.enum(["draft", "reviewed", "favorite", "needs_rewrite", "ready_to_record", "archived"]).default("draft"),
  projectId: z.string().cuid().optional(),
  savedCreatorId: z.string().cuid().optional(),
});

// ============= Notes =============

export const createNoteSchema = z.object({
  body: z.string().min(1, "Note body is required").max(10000),
});

// ============= Creators =============

export const createCreatorSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  platform: z.enum(["youtube", "twitter", "instagram", "tiktok", "linkedin", "facebook", "podcast", "blog", "other"]).default("youtube"),
  pageUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  toneNotes: z.string().max(2000).optional(),
  topicFocus: z.string().max(1000).optional(),
  trustLevel: z.enum(["trusted", "mixed", "speculative", "entertainment_only"]).default("trusted"),
  styleFingerprintJson: z.record(z.string(), z.unknown()).optional(),
});

export const updateCreatorSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  platform: z.enum(["youtube", "twitter", "instagram", "tiktok", "linkedin", "facebook", "podcast", "blog", "other"]).optional(),
  pageUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  description: z.string().max(2000).optional().or(z.null()),
  toneNotes: z.string().max(2000).optional().or(z.null()),
  topicFocus: z.string().max(1000).optional().or(z.null()),
  trustLevel: z.enum(["trusted", "mixed", "speculative", "entertainment_only"]).optional(),
  isActive: z.boolean().optional(),
  styleFingerprintJson: z.record(z.string(), z.unknown()).optional().or(z.null()),
}).strict();

// ============= Projects =============

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").default("#6366f1"),
  icon: z.string().max(50).default("folder"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().or(z.null()),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  icon: z.string().max(50).optional(),
}).strict();

// ============= Generate =============

export const generateContentSchema = z.object({
  contentItemIds: z.array(z.string().cuid()).min(1, "At least one content item required"),
  creatorId: z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  outputType: z.enum([
    "content_idea", "facebook_post", "discussion_post", "email",
    "workshop_lesson", "blog_outline", "talking_head_script", "reel_script",
    "green_screen_script", "talking_points", "book_note", "carousel_outline",
  ]).default("content_idea"),
  contentMode: z.enum(["educational", "story_driven", "contrarian", "tactical", "emotional", "authority_building"]).optional(),
  audience: z.string().max(200).optional(),
  originalityLevel: z.number().int().min(10).max(100).default(70),
  meshMethodology: z.boolean().default(true),
  meshWithMethodology: z.boolean().optional(),
  toneNotes: z.string().max(2000).optional(),
  category: z.string().max(200).optional(),
});

export const updateGeneratedOutputSchema = z.object({
  feedbackStatus: z.enum(["nailed_it", "too_generic", "too_close_to_source", "more_tactical", "more_like_me"]).optional(),
  reviewStatus: z.enum(["draft", "reviewed", "favorite", "needs_rewrite", "ready_to_record", "archived"]).optional(),
  targetPublishDate: z.string().datetime().nullable().optional(),
  targetPlatform: z.string().max(100).nullable().optional(),
  title: z.string().min(1).max(500).optional(),
}).strict();

export const feedbackSchema = z.object({
  feedbackStatus: z.enum(["nailed_it", "too_generic", "too_close_to_source", "more_tactical", "more_like_me"]),
});

// ============= Settings =============

export const settingsSchema = z.object({
  settings: z.record(z.string(), z.unknown()).optional(),
  key: z.string().max(200).optional(),
  value: z.unknown().optional(),
}).passthrough(); // Allow top-level key-value pairs for bulk save

// ============= Pagination =============

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ============= Helper to validate and extract =============

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): { data: T } | { error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    return { error: issues };
  }
  return { data: result.data };
}

export function validateParams(searchParams: URLSearchParams): { page: number; limit: number } {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20") || 20));
  return { page, limit };
}

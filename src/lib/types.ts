// Shared types used by both API routes and frontend
// Generated from Prisma schema - keep in sync

// ============= Enums =============

export const SOURCE_TYPES = [
  "youtube",
  "youtube_short",
  "screenshot_set",
  "manual_text",
  "user_content",
  "other",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const REVIEW_STATUSES = [
  "draft",
  "reviewed",
  "favorite",
  "needs_rewrite",
  "ready_to_record",
  "archived",
] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const TRUST_LEVELS = [
  "trusted",
  "mixed",
  "speculative",
  "entertainment_only",
] as const;
export type TrustLevel = (typeof TRUST_LEVELS)[number];

export const OUTPUT_TYPES = [
  "content_idea",
  "facebook_post",
  "discussion_post",
  "email",
  "workshop_lesson",
  "blog_outline",
  "talking_head_script",
  "reel_script",
  "green_screen_script",
  "talking_points",
  "book_note",
  "carousel_outline",
] as const;
export type OutputType = (typeof OUTPUT_TYPES)[number];

export const CONTENT_MODES = [
  "educational",
  "story_driven",
  "contrarian",
  "tactical",
  "emotional",
  "authority_building",
] as const;
export type ContentMode = (typeof CONTENT_MODES)[number];

export const FEEDBACK_STATUSES = [
  "nailed_it",
  "too_generic",
  "too_close_to_source",
  "more_tactical",
  "more_like_me",
] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const PLATFORMS = [
  "youtube",
  "twitter",
  "instagram",
  "tiktok",
  "linkedin",
  "facebook",
  "podcast",
  "blog",
  "other",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const TOPIC_AREAS = [
  "coaching",
  "mindset",
  "marketing",
  "systems",
  "processes",
  "leadership",
  "ai",
] as const;
export type TopicArea = (typeof TOPIC_AREAS)[number];

// ============= API Response Types =============

export interface ContentItemSummary {
  id: string;
  sourceType: string;
  title: string;
  shortSummary?: string | null;
  status: string;
  createdAt: string;
  project?: { id: string; name: string; color?: string | null } | null;
  savedCreator?: { id: string; name: string } | null;
  categories?: { category: { id: string; name: string } }[];
  tags?: { tag: { id: string; name: string } }[];
  _count?: { generatedOutputs: number; notes: number };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatorSummary {
  id: string;
  name: string;
  platform: string;
  trustLevel: string;
  pageUrl?: string | null;
  description?: string | null;
  _count?: { contentItems: number; generatedOutputs: number };
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  _count?: { contentItems: number; generatedOutputs: number };
}

export interface GeneratedOutputSummary {
  id: string;
  outputType: string;
  title: string;
  outputText: string;
  reviewStatus: string;
  feedbackStatus?: string | null;
  targetPublishDate?: string | null;
  createdAt: string;
  contentItem?: { id: string; title: string } | null;
  project?: { id: string; name: string } | null;
  creator?: { id: string; name: string } | null;
}

// ============= API Error Response =============

export interface ApiError {
  error: string;
}

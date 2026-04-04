export const SOURCE_TYPES = [
  "youtube",
  "youtube_short",
  "screenshot_set",
  "manual_text",
  "user_content",
  "other",
] as const;

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

export const OUTPUT_TYPE_LABELS: Record<string, string> = {
  content_idea: "Content Idea",
  facebook_post: "Facebook Post",
  discussion_post: "Discussion Post",
  email: "Email Angle",
  workshop_lesson: "Workshop Lesson",
  blog_outline: "Blog Outline",
  talking_head_script: "Talking Head Script",
  reel_script: "Short-Form Reel Script",
  green_screen_script: "Green Screen Script",
  talking_points: "Talking Points",
  book_note: "Book Note",
  carousel_outline: "Carousel Outline",
};

export const CONTENT_MODES = [
  "educational",
  "story_driven",
  "contrarian",
  "tactical",
  "emotional",
  "authority_building",
] as const;

export const CONTENT_MODE_LABELS: Record<string, string> = {
  educational: "Educational",
  story_driven: "Story-Driven",
  contrarian: "Contrarian",
  tactical: "Tactical",
  emotional: "Emotional",
  authority_building: "Authority Building",
};

export const REVIEW_STATUSES = [
  "draft",
  "reviewed",
  "favorite",
  "needs_rewrite",
  "ready_to_record",
  "archived",
] as const;

export const REVIEW_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  reviewed: "Reviewed",
  favorite: "Favorite",
  needs_rewrite: "Needs Rewrite",
  ready_to_record: "Ready to Record",
  archived: "Archived",
};

export const TRUST_LEVELS = [
  "trusted",
  "mixed",
  "speculative",
  "entertainment_only",
] as const;

export const TRUST_LEVEL_LABELS: Record<string, string> = {
  trusted: "Trusted",
  mixed: "Mixed",
  speculative: "Speculative",
  entertainment_only: "Entertainment Only",
};

export const FEEDBACK_OPTIONS = [
  { value: "nailed_it", label: "Nailed It", emoji: "check" },
  { value: "too_generic", label: "Too Generic", emoji: "minus" },
  { value: "too_close_to_source", label: "Too Close to Source", emoji: "alert" },
  { value: "more_tactical", label: "More Tactical", emoji: "target" },
  { value: "more_like_me", label: "More Like Me", emoji: "user" },
] as const;

export const TREND_AREAS = [
  "coaching",
  "mindset",
  "marketing",
  "systems",
  "processes",
  "leadership",
  "ai",
] as const;

export const AUDIENCES = [
  "State Farm agents",
  "Small business owners",
  "Coaches & consultants",
  "Beginners",
  "Advanced operators",
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/inbox", label: "Inbox", icon: "Inbox" },
  { href: "/library", label: "Library", icon: "Library" },
  { href: "/creators", label: "Creators", icon: "Users" },
  { href: "/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/ideas", label: "Ideas", icon: "Lightbulb" },
  { href: "/generate", label: "Generate", icon: "Sparkles" },
  { href: "/trends", label: "Trends", icon: "TrendingUp" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;

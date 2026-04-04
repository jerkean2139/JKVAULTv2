import { isMockMode } from "@/lib/utils/mock-mode";

export interface YouTubeMetadata {
  videoId: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  publishedAt?: string;
  transcript?: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

export function isYouTubeShort(url: string): boolean {
  return /youtube\.com\/shorts\//.test(url);
}

const MOCK_YOUTUBE: YouTubeMetadata = {
  videoId: "mock-video-123",
  title: "How Top Performers Build Systems That Scale",
  author: "Business Growth Channel",
  thumbnailUrl: "/placeholder-thumb.jpg",
  publishedAt: new Date().toISOString(),
  transcript:
    "Welcome back to the channel. Today we're talking about something that separates the top 1% of business owners from everyone else: systems. Not just any systems - intelligent systems that scale. Most people think systems means writing SOPs and calling it a day. But the best operators I've worked with think about systems as living organisms. They evolve, they adapt, they get better over time. Here's my framework for building systems that actually scale. Step one: identify your highest-leverage repeatable process. This is the thing you do most often that generates the most revenue. Step two: document it at the decision-point level, not the click-by-click level. You want thinking frameworks, not instruction manuals. Step three: assign an owner. A system without an owner is just a document nobody reads. Step four: build in feedback loops. Every 30 days, the owner should improve one thing about the system. Step five: measure the output, not the activity. If your system generates results, the details don't matter. That's it. Five steps to systems that scale. If you found this valuable, subscribe and I'll see you next time.",
};

export async function fetchYouTubeContent(url: string): Promise<YouTubeMetadata> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const videoId = extractVideoId(url) || "mock-id";
    return { ...MOCK_YOUTUBE, videoId };
  }

  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  let transcript: string | undefined;
  try {
    const { YoutubeTranscript } = await import("youtube-transcript");
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    transcript = segments.map((s: { text: string }) => s.text).join(" ");
  } catch {
    // transcript not available
  }

  // Basic metadata from oEmbed (no API key needed)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        videoId,
        title: data.title || "Untitled Video",
        author: data.author_name || "Unknown",
        thumbnailUrl: data.thumbnail_url || "",
        transcript,
      };
    }
  } catch {
    // oEmbed failed
  }

  return {
    videoId,
    title: "YouTube Video",
    author: "Unknown",
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    transcript,
  };
}

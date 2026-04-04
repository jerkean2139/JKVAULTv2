import { describe, it, expect } from "vitest";

// Test YouTube URL extraction logic
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

function isYouTubeShort(url: string): boolean {
  return /youtube\.com\/shorts\//.test(url);
}

describe("YouTube URL Parsing", () => {
  it("should extract video ID from standard URL", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should extract video ID from short URL", () => {
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should extract video ID from shorts URL", () => {
    expect(extractVideoId("https://youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should extract video ID from embed URL", () => {
    expect(extractVideoId("https://youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("should return null for non-YouTube URL", () => {
    expect(extractVideoId("https://example.com/video")).toBeNull();
  });

  it("should detect YouTube Shorts", () => {
    expect(isYouTubeShort("https://youtube.com/shorts/dQw4w9WgXcQ")).toBe(true);
    expect(isYouTubeShort("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(false);
  });
});

import { describe, it, expect } from "vitest";

// Test the tokenizer and cosine similarity logic directly
function tokenize(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return freq;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  const allKeys = new Set([...a.keys(), ...b.keys()]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (const key of allKeys) {
    const va = a.get(key) || 0;
    const vb = b.get(key) || 0;
    dotProduct += va * vb;
    normA += va * va;
    normB += vb * vb;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

describe("Similarity Service", () => {
  it("should tokenize text into word frequency map", () => {
    const result = tokenize("hello world hello");
    expect(result.get("hello")).toBe(2);
    expect(result.get("world")).toBe(1);
  });

  it("should filter short words", () => {
    const result = tokenize("I am a big man");
    expect(result.has("big")).toBe(true);
    expect(result.has("man")).toBe(true);
    expect(result.has("am")).toBe(false);
  });

  it("should return 1.0 for identical texts", () => {
    const text = "business systems coaching leadership growth";
    const a = tokenize(text);
    const b = tokenize(text);
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
  });

  it("should return 0 for completely different texts", () => {
    const a = tokenize("apple banana cherry");
    const b = tokenize("xylophone zebra quantum");
    expect(cosineSimilarity(a, b)).toBe(0);
  });

  it("should return moderate similarity for partially overlapping texts", () => {
    const a = tokenize("business growth systems scaling marketing");
    const b = tokenize("business leadership coaching marketing team");
    const sim = cosineSimilarity(a, b);
    expect(sim).toBeGreaterThan(0.2);
    expect(sim).toBeLessThan(0.8);
  });
});

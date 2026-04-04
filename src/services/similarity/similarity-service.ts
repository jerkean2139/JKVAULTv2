import { isMockMode } from "@/lib/utils/mock-mode";
import prisma from "@/lib/db";

export interface SimilarityResult {
  score: number;
  label: "low" | "moderate" | "high";
  similarItems: { id: string; title: string; score: number }[];
  notes: string;
}

export function tokenize(text: string): Map<string, number> {
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

export function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
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

function scoreToLabel(score: number): "low" | "moderate" | "high" {
  if (score >= 0.7) return "high";
  if (score >= 0.4) return "moderate";
  return "low";
}

// Exports for openai-client mock path
export function mockCheckSimilarity(): { score: number; label: string } {
  return { score: 0.18, label: "low" };
}

export async function checkSimilarityReal(
  text: string,
  existingTexts: string[]
): Promise<{ score: number; label: string }> {
  const inputTokens = tokenize(text);
  let maxScore = 0;
  for (const existing of existingTexts) {
    const score = cosineSimilarity(inputTokens, tokenize(existing));
    if (score > maxScore) maxScore = score;
  }
  return { score: Math.round(maxScore * 100) / 100, label: scoreToLabel(maxScore) };
}

export async function checkSimilarity(
  text: string,
  excludeId?: string
): Promise<SimilarityResult> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 200));
    return {
      score: 0.23,
      label: "low",
      similarItems: [
        { id: "mock-1", title: "Related content about business systems", score: 0.23 },
      ],
      notes: "Low similarity to existing content. This appears to be a fresh angle.",
    };
  }

  const inputTokens = tokenize(text);

  // Fetch only lightweight fields needed for comparison
  // Use shortSummary instead of full rawText to reduce memory usage
  const [existingItems, existingOutputs] = await Promise.all([
    prisma.contentItem.findMany({
      where: excludeId ? { id: { not: excludeId } } : undefined,
      select: { id: true, title: true, shortSummary: true },
      take: 200,
      orderBy: { createdAt: "desc" },
    }),
    prisma.generatedOutput.findMany({
      select: { id: true, title: true, outputText: true },
      take: 100,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  let maxScore = 0;
  const similarItems: { id: string; title: string; score: number }[] = [];

  for (const item of existingItems) {
    const itemText = item.shortSummary || item.title;
    if (!itemText) continue;
    const score = cosineSimilarity(inputTokens, tokenize(itemText));
    if (score > 0.2) {
      similarItems.push({ id: item.id, title: item.title, score: Math.round(score * 100) / 100 });
    }
    if (score > maxScore) maxScore = score;
  }

  // For generated outputs, compare against a truncated version to save memory
  for (const output of existingOutputs) {
    const truncated = output.outputText.slice(0, 2000);
    const score = cosineSimilarity(inputTokens, tokenize(truncated));
    if (score > 0.2) {
      similarItems.push({ id: output.id, title: output.title, score: Math.round(score * 100) / 100 });
    }
    if (score > maxScore) maxScore = score;
  }

  similarItems.sort((a, b) => b.score - a.score);
  const topSimilar = similarItems.slice(0, 5);
  const label = scoreToLabel(maxScore);

  const notes =
    label === "high"
      ? "High similarity detected. Consider varying the angle or adding more original insight."
      : label === "moderate"
      ? "Some overlap with existing content. The core concepts are similar but the framing appears different."
      : "Low similarity to existing content. This appears to be a fresh angle.";

  return {
    score: Math.round(maxScore * 100) / 100,
    label,
    similarItems: topSimilar,
    notes,
  };
}

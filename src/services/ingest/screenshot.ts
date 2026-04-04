import { isMockMode } from "@/lib/utils/mock-mode";

const MOCK_OCR_TEXT = `Screenshot Analysis Results:

Post by @BusinessCoach:
"The #1 mistake I see agency owners make: they try to scale before they systemize.

You can't pour more water into a leaky bucket.

Fix your operations first:
1. Document your top 5 processes
2. Assign owners to each
3. Build feedback loops
4. Measure outputs, not activities

Then scale."

248 likes, 47 comments, 12 shares`;

export async function extractTextFromScreenshots(
  files: { name: string; buffer: Buffer }[]
): Promise<string> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 500));
    return files
      .map(
        (f, i) =>
          `[Screenshot ${i + 1}: ${f.name}]\n${MOCK_OCR_TEXT}\n`
      )
      .join("\n---\n\n");
  }

  // Real OCR with tesseract.js
  const { createWorker } = await import("tesseract.js");
  const results: string[] = [];

  for (const file of files) {
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(file.buffer);
    results.push(`[Screenshot: ${file.name}]\n${data.text}`);
    await worker.terminate();
  }

  return results.join("\n---\n\n");
}

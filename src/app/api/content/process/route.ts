import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { analyzeContent } from "@/services/ai/analysis";
import { fetchYouTubeContent, isYouTubeUrl, isYouTubeShort } from "@/services/ingest/youtube";
import { checkSimilarity } from "@/services/similarity/similarity-service";

export async function POST(request: NextRequest) {
  let job;
  try {
    const body = await request.json();
    const { sourceType, sourceUrl, title, rawText, screenshotText } = body;

    // Create processing job
    job = await prisma.processingJob.create({
      data: {
        jobType: "content_analysis",
        status: "processing",
        inputJson: body,
      },
    });

    let contentText = rawText || "";
    let contentTitle = title || "Untitled";
    let creatorNameRaw: string | undefined;
    let thumbnailUrl: string | undefined;
    let transcriptText: string | undefined;
    let extractedScreenshotText: string | undefined;
    let finalSourceType = sourceType || "manual_text";
    let sourceUrlFinal = sourceUrl;
    let needsTranscript = false;

    // Handle YouTube ingestion
    if (sourceUrl && isYouTubeUrl(sourceUrl)) {
      finalSourceType = isYouTubeShort(sourceUrl) ? "youtube_short" : "youtube";
      const ytData = await fetchYouTubeContent(sourceUrl);
      contentTitle = title || ytData.title;
      creatorNameRaw = ytData.author;
      thumbnailUrl = ytData.thumbnailUrl;
      sourceUrlFinal = sourceUrl;

      if (ytData.transcript) {
        transcriptText = ytData.transcript;
        contentText = ytData.transcript;
      } else {
        needsTranscript = true;
        contentText = rawText || `YouTube video: ${ytData.title} by ${ytData.author}`;
      }
    }

    // Handle screenshot text
    if (screenshotText) {
      extractedScreenshotText = screenshotText;
      contentText = screenshotText;
      finalSourceType = sourceType || "screenshot_set";
    }

    // Handle user content type
    if (sourceType === "user_content") {
      finalSourceType = "user_content";
    }

    // AI Analysis
    const analysis = await analyzeContent(contentText, contentTitle);

    // Similarity check
    const similarity = await checkSimilarity(contentText);

    // Create content item
    const contentItem = await prisma.contentItem.create({
      data: {
        sourceType: finalSourceType,
        sourceUrl: sourceUrlFinal,
        title: contentTitle,
        creatorNameRaw,
        thumbnailUrl,
        rawText: rawText || contentText,
        transcriptText,
        extractedScreenshotText,
        shortSummary: analysis.shortSummary,
        detailedSummary: analysis.detailedSummary,
        hookAnalysisJson: analysis.hookAnalysis as unknown as Record<string, string>,
        persuasionAngle: analysis.persuasionAngle,
        usefulVsFluffJson: analysis.usefulVsFluff as unknown as Record<string, string>,
        businessTakeawaysJson: analysis.businessTakeaways as unknown as string[],
        categorizationReasoning: analysis.categorizationReasoning,
        tagsJson: analysis.suggestedTags as unknown as string[],
        energyStyle: analysis.energyStyle,
        audienceFit: analysis.audienceFit,
        similarityNotes: similarity.notes,
        status: "draft",
        needsTranscript,
      },
    });

    // Create category associations
    if (analysis.suggestedCategories?.length) {
      for (const catSuggestion of analysis.suggestedCategories) {
        const category = await prisma.category.findFirst({
          where: { name: { equals: catSuggestion.name, mode: "insensitive" } },
        });
        if (category) {
          await prisma.contentItemCategory.create({
            data: {
              contentItemId: contentItem.id,
              categoryId: category.id,
              confidenceScore: catSuggestion.confidence,
            },
          }).catch(() => {}); // ignore duplicate
        }
      }
    }

    // Create tag associations
    if (analysis.suggestedTags?.length) {
      for (const tagName of analysis.suggestedTags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName.toLowerCase() },
          update: {},
          create: { name: tagName.toLowerCase() },
        });
        await prisma.contentItemTag.create({
          data: { contentItemId: contentItem.id, tagId: tag.id },
        }).catch(() => {}); // ignore duplicate
      }
    }

    // Update processing job
    await prisma.processingJob.update({
      where: { id: job.id },
      data: { status: "completed", outputJson: { contentItemId: contentItem.id } },
    });

    // Fetch complete item with relations
    const result = await prisma.contentItem.findUnique({
      where: { id: contentItem.id },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/content/process error:", error);
    if (job) {
      await prisma.processingJob.update({
        where: { id: job.id },
        data: { status: "failed", errorMessage: String(error) },
      }).catch(() => {});
    }
    return NextResponse.json(
      { error: "Processing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

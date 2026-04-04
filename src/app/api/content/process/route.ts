import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { analyzeContent } from "@/services/ai/analysis";
import { fetchYouTubeContent, isYouTubeUrl, isYouTubeShort } from "@/services/ingest/youtube";
import { checkSimilarity } from "@/services/similarity/similarity-service";
import { validateBody, processContentSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  let job;
  try {
    const raw = await request.json();
    const parsed = validateBody(processContentSchema, raw);
    if ("error" in parsed) {
      return apiError(parsed.error, 400);
    }

    const { sourceType, sourceUrl, title, rawText, screenshotText } = parsed.data;

    // Create processing job
    job = await prisma.processingJob.create({
      data: {
        jobType: "content_analysis",
        status: "processing",
        inputJson: JSON.parse(JSON.stringify(parsed.data)),
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

    // Validate contentText is non-empty before analysis
    if (!contentText.trim()) {
      return apiError("No content text available for analysis", 400);
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

    // Create category associations - batched to fix N+1 queries
    if (analysis.suggestedCategories?.length) {
      const categoryNames = analysis.suggestedCategories.map((c) => c.name);
      const matchingCategories = await prisma.category.findMany({
        where: { name: { in: categoryNames, mode: "insensitive" } },
      });

      if (matchingCategories.length > 0) {
        const categoryAssociations = matchingCategories.map((cat) => {
          const suggestion = analysis.suggestedCategories!.find(
            (s) => s.name.toLowerCase() === cat.name.toLowerCase()
          );
          return {
            contentItemId: contentItem.id,
            categoryId: cat.id,
            confidenceScore: suggestion?.confidence ?? 0,
          };
        });

        await prisma.contentItemCategory.createMany({
          data: categoryAssociations,
          skipDuplicates: true,
        });
      }
    }

    // Create tag associations - batched to fix N+1 queries
    if (analysis.suggestedTags?.length) {
      const tags = await Promise.all(
        analysis.suggestedTags.map((tagName) =>
          prisma.tag.upsert({
            where: { name: tagName.toLowerCase() },
            update: {},
            create: { name: tagName.toLowerCase() },
          })
        )
      );

      await prisma.contentItemTag.createMany({
        data: tags.map((tag) => ({
          contentItemId: contentItem.id,
          tagId: tag.id,
        })),
        skipDuplicates: true,
      });
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
        data: { status: "failed", errorMessage: "Content processing failed" },
      }).catch((e) => {
        if (!e.message?.includes("Unique constraint")) throw e;
      });
    }
    return apiError("Content processing failed", 500, error);
  }
}

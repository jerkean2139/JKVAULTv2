import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateContent } from "@/services/ai/generator";
import { checkSimilarity } from "@/services/similarity/similarity-service";
import { validateBody, validateParams, generateContentSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const outputType = searchParams.get("outputType");
    const reviewStatus = searchParams.get("reviewStatus");
    const contentItemId = searchParams.get("contentItemId");
    const { page, limit } = validateParams(searchParams);

    const where: Record<string, unknown> = {};
    if (outputType) where.outputType = outputType;
    if (reviewStatus) where.reviewStatus = reviewStatus;
    if (contentItemId) where.contentItemId = contentItemId;

    const [items, total] = await Promise.all([
      prisma.generatedOutput.findMany({
        where,
        include: {
          contentItem: { select: { id: true, title: true } },
          project: { select: { id: true, name: true } },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.generatedOutput.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return apiError("Failed to fetch outputs", 500, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateBody(generateContentSchema, body);
    if ("error" in validation) {
      return apiError(validation.error, 400);
    }

    const {
      contentItemIds, creatorId, projectId, outputType, contentMode,
      audience, originalityLevel, meshWithMethodology, toneNotes,
    } = validation.data;

    // Gather source texts
    const sourceTexts: string[] = [];
    if (contentItemIds?.length) {
      const items = await prisma.contentItem.findMany({
        where: { id: { in: contentItemIds } },
        select: { rawText: true, transcriptText: true, shortSummary: true, detailedSummary: true },
      });
      for (const item of items) {
        sourceTexts.push(
          item.transcriptText || item.rawText || item.detailedSummary || item.shortSummary || ""
        );
      }
    }

    // Get creator style if specified
    let creatorStyle: string | undefined;
    if (creatorId) {
      const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
      if (creator) {
        creatorStyle = `Style: ${creator.toneNotes || ""}. Focus: ${creator.topicFocus || ""}`;
      }
    }

    // Get methodology settings if toggle is on
    let methodologySettings: Record<string, unknown> | undefined;
    if (meshWithMethodology) {
      const setting = await prisma.appSetting.findUnique({ where: { key: "methodology" } });
      if (setting) methodologySettings = setting.valueJson as Record<string, unknown>;
    }

    // Generate
    const result = await generateContent({
      sourceTexts,
      outputType: outputType || "content_idea",
      contentMode,
      audience,
      originalityLevel: String(originalityLevel || "medium"),
      meshWithMethodology,
      methodologySettings,
      toneNotes,
      creatorStyle,
    });

    // Similarity check
    const similarity = await checkSimilarity(result.outputText);

    // Save to DB
    const output = await prisma.generatedOutput.create({
      data: {
        contentItemId: contentItemIds?.[0],
        projectId,
        creatorId,
        outputType: outputType || "content_idea",
        title: result.title,
        outputText: result.outputText,
        similarityScore: similarity.score,
        originalityLevel: String(originalityLevel || "medium"),
        toneMode: toneNotes || "default",
        contentMode,
        audience,
        reviewStatus: "draft",
      },
      include: {
        contentItem: { select: { id: true, title: true } },
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ ...output, similarity }, { status: 201 });
  } catch (error) {
    return apiError("Generation failed", 500, error);
  }
}

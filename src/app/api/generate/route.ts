import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateContent } from "@/services/ai/generator";
import { checkSimilarity } from "@/services/similarity/similarity-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const outputType = searchParams.get("outputType");
    const reviewStatus = searchParams.get("reviewStatus");
    const contentItemId = searchParams.get("contentItemId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

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
    console.error("GET /api/generate error:", error);
    return NextResponse.json({ error: "Failed to fetch outputs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contentItemIds,
      creatorId,
      projectId,
      outputType,
      contentMode,
      audience,
      originalityLevel,
      meshWithMethodology,
      toneNotes,
    } = body;

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
      originalityLevel,
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
        originalityLevel: originalityLevel || "medium",
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
    console.error("POST /api/generate error:", error);
    return NextResponse.json(
      { error: "Generation failed", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

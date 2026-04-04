import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const projectId = searchParams.get("projectId");
    const categoryId = searchParams.get("categoryId");
    const creatorId = searchParams.get("creatorId");
    const status = searchParams.get("status");
    const sourceType = searchParams.get("sourceType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sort = searchParams.get("sort") || "newest";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortSummary: { contains: search, mode: "insensitive" } },
        { creatorNameRaw: { contains: search, mode: "insensitive" } },
      ];
    }
    if (projectId) where.projectId = projectId;
    if (creatorId) where.savedCreatorId = creatorId;
    if (status) where.status = status;
    if (sourceType) where.sourceType = sourceType;
    if (categoryId) {
      where.categories = { some: { categoryId } };
    }

    const orderBy =
      sort === "oldest" ? { createdAt: "asc" as const } :
      sort === "title" ? { title: "asc" as const } :
      { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        where,
        include: {
          project: { select: { id: true, name: true, color: true } },
          savedCreator: { select: { id: true, name: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          _count: { select: { generatedOutputs: true, notes: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contentItem.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await prisma.contentItem.create({
      data: {
        sourceType: body.sourceType || "manual_text",
        sourceUrl: body.sourceUrl,
        title: body.title || "Untitled",
        creatorNameRaw: body.creatorNameRaw,
        rawText: body.rawText,
        transcriptText: body.transcriptText,
        status: body.status || "draft",
        projectId: body.projectId,
        savedCreatorId: body.savedCreatorId,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/content error:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}

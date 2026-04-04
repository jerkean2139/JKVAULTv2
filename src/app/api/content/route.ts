import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, validateParams, createContentSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const projectId = searchParams.get("projectId");
    const categoryId = searchParams.get("categoryId");
    const creatorId = searchParams.get("creatorId");
    const status = searchParams.get("status");
    const sourceType = searchParams.get("sourceType");
    const { page, limit } = validateParams(searchParams);
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
    return apiError("Failed to fetch content", 500, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parsed = validateBody(createContentSchema, raw);
    if ("error" in parsed) {
      return apiError(parsed.error, 400);
    }

    const { data } = parsed;
    const item = await prisma.contentItem.create({
      data: {
        sourceType: data.sourceType,
        sourceUrl: data.sourceUrl,
        title: data.title,
        creatorNameRaw: data.creatorNameRaw,
        rawText: data.rawText,
        transcriptText: data.transcriptText,
        status: data.status,
        projectId: data.projectId,
        savedCreatorId: data.savedCreatorId,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return apiError("Failed to create content", 500, error);
  }
}

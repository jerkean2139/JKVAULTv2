import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, updateContentSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        project: true,
        savedCreator: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        generatedOutputs: { orderBy: { createdAt: "desc" } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!item) return apiError("Not found", 404);
    return NextResponse.json(item);
  } catch (error) {
    return apiError("Failed to fetch content", 500, error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.contentItem.findUnique({ where: { id } });
    if (!existing) return apiError("Not found", 404);

    const raw = await request.json();
    const parsed = validateBody(updateContentSchema, raw);
    if ("error" in parsed) {
      return apiError(parsed.error, 400);
    }

    const { data } = parsed;
    const item = await prisma.contentItem.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.projectId !== undefined && { projectId: data.projectId }),
        ...(data.savedCreatorId !== undefined && { savedCreatorId: data.savedCreatorId }),
        ...(data.transcriptText !== undefined && { transcriptText: data.transcriptText }),
        ...(data.needsTranscript !== undefined && { needsTranscript: data.needsTranscript }),
        ...(data.targetPublishDate !== undefined && { targetPublishDate: data.targetPublishDate }),
        ...(data.targetPlatform !== undefined && { targetPlatform: data.targetPlatform }),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return apiError("Failed to update content", 500, error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.contentItem.findUnique({ where: { id } });
    if (!existing) return apiError("Not found", 404);

    await prisma.contentItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError("Failed to delete content", 500, error);
  }
}

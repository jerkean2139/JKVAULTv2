import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

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
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error("GET /api/content/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.contentItem.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.projectId !== undefined && { projectId: body.projectId }),
        ...(body.savedCreatorId !== undefined && { savedCreatorId: body.savedCreatorId }),
        ...(body.transcriptText !== undefined && { transcriptText: body.transcriptText }),
        ...(body.needsTranscript !== undefined && { needsTranscript: body.needsTranscript }),
        ...(body.targetPublishDate !== undefined && { targetPublishDate: body.targetPublishDate }),
        ...(body.targetPlatform !== undefined && { targetPlatform: body.targetPlatform }),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("PATCH /api/content/[id] error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.contentItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/content/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const output = await prisma.generatedOutput.findUnique({
      where: { id },
      include: {
        contentItem: { select: { id: true, title: true, shortSummary: true } },
        project: true,
        creator: true,
        notes: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!output) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(output);
  } catch (error) {
    console.error("GET /api/generate/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch output" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const output = await prisma.generatedOutput.update({
      where: { id },
      data: {
        ...(body.feedbackStatus !== undefined && { feedbackStatus: body.feedbackStatus }),
        ...(body.reviewStatus !== undefined && { reviewStatus: body.reviewStatus }),
        ...(body.targetPublishDate !== undefined && { targetPublishDate: body.targetPublishDate }),
        ...(body.targetPlatform !== undefined && { targetPlatform: body.targetPlatform }),
        ...(body.title !== undefined && { title: body.title }),
      },
    });
    return NextResponse.json(output);
  } catch (error) {
    console.error("PATCH /api/generate/[id] error:", error);
    return NextResponse.json({ error: "Failed to update output" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.generatedOutput.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/generate/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete output" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const creator = await prisma.creator.findUnique({
      where: { id },
      include: {
        contentItems: { orderBy: { createdAt: "desc" }, take: 20 },
        generatedOutputs: { orderBy: { createdAt: "desc" }, take: 10 },
        _count: { select: { contentItems: true, generatedOutputs: true } },
      },
    });
    if (!creator) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(creator);
  } catch (error) {
    console.error("GET /api/creators/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch creator" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const creator = await prisma.creator.update({ where: { id }, data: body });
    return NextResponse.json(creator);
  } catch (error) {
    console.error("PATCH /api/creators/[id] error:", error);
    return NextResponse.json({ error: "Failed to update creator" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.creator.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/creators/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete creator" }, { status: 500 });
  }
}

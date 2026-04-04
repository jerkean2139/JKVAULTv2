import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const creators = await prisma.creator.findMany({
      include: { _count: { select: { contentItems: true, generatedOutputs: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(creators);
  } catch (error) {
    console.error("GET /api/creators error:", error);
    return NextResponse.json({ error: "Failed to fetch creators" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const count = await prisma.creator.count();
    if (count >= 20) {
      return NextResponse.json({ error: "Maximum 20 creators allowed" }, { status: 400 });
    }
    const body = await request.json();
    const creator = await prisma.creator.create({
      data: {
        name: body.name,
        platform: body.platform || "youtube",
        pageUrl: body.pageUrl,
        description: body.description,
        toneNotes: body.toneNotes,
        topicFocus: body.topicFocus,
        trustLevel: body.trustLevel || "trusted",
        styleFingerprintJson: body.styleFingerprintJson,
      },
    });
    return NextResponse.json(creator, { status: 201 });
  } catch (error) {
    console.error("POST /api/creators error:", error);
    return NextResponse.json({ error: "Failed to create creator" }, { status: 500 });
  }
}

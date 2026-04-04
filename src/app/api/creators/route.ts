import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, createCreatorSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const creators = await prisma.creator.findMany({
      include: { _count: { select: { contentItems: true, generatedOutputs: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(creators);
  } catch (error) {
    return apiError("Failed to fetch creators", 500, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const count = await prisma.creator.count();
    if (count >= 20) {
      return apiError("Maximum 20 creators allowed", 400);
    }
    const body = await request.json();
    const validation = validateBody(createCreatorSchema, body);
    if ("error" in validation) {
      return apiError(validation.error, 400);
    }
    const creator = await prisma.creator.create({
      data: {
        name: validation.data.name,
        platform: validation.data.platform,
        pageUrl: validation.data.pageUrl,
        description: validation.data.description,
        toneNotes: validation.data.toneNotes,
        topicFocus: validation.data.topicFocus,
        trustLevel: validation.data.trustLevel,
        ...(validation.data.styleFingerprintJson && {
          styleFingerprintJson: JSON.parse(JSON.stringify(validation.data.styleFingerprintJson)),
        }),
      },
    });
    return NextResponse.json(creator, { status: 201 });
  } catch (error) {
    return apiError("Failed to create creator", 500, error);
  }
}

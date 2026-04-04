import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, updateCreatorSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

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
    if (!creator) return apiError("Not found", 404);
    return NextResponse.json(creator);
  } catch (error) {
    return apiError("Failed to fetch creator", 500, error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateBody(updateCreatorSchema, body);
    if ("error" in validation) {
      return apiError(validation.error, 400);
    }
    const { styleFingerprintJson, ...rest } = validation.data;
    const creator = await prisma.creator.update({
      where: { id },
      data: {
        ...rest,
        ...(styleFingerprintJson !== undefined && {
          styleFingerprintJson: styleFingerprintJson === null
            ? null as unknown as undefined
            : JSON.parse(JSON.stringify(styleFingerprintJson)),
        }),
      },
    });
    return NextResponse.json(creator);
  } catch (error) {
    return apiError("Failed to update creator", 500, error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.creator.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError("Failed to delete creator", 500, error);
  }
}

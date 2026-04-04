import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, updateGeneratedOutputSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

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
    if (!output) return apiError("Not found", 404);
    return NextResponse.json(output);
  } catch (error) {
    return apiError("Failed to fetch output", 500, error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateBody(updateGeneratedOutputSchema, body);
    if ("error" in validation) {
      return apiError(validation.error, 400);
    }
    const output = await prisma.generatedOutput.update({
      where: { id },
      data: validation.data,
    });
    return NextResponse.json(output);
  } catch (error) {
    return apiError("Failed to update output", 500, error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.generatedOutput.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError("Failed to delete output", 500, error);
  }
}

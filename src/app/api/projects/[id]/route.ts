import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, updateProjectSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        contentItems: { orderBy: { createdAt: "desc" }, take: 20 },
        _count: { select: { contentItems: true, generatedOutputs: true } },
      },
    });
    if (!project) return apiError("Not found", 404);
    return NextResponse.json(project);
  } catch (error) {
    return apiError("Failed to fetch project", 500, error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateBody(updateProjectSchema, body);
    if ("error" in validation) {
      return apiError(validation.error, 400);
    }
    const project = await prisma.project.update({ where: { id }, data: validation.data });
    return NextResponse.json(project);
  } catch (error) {
    return apiError("Failed to update project", 500, error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError("Failed to delete project", 500, error);
  }
}

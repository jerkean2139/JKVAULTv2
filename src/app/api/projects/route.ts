import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, createProjectSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { _count: { select: { contentItems: true, generatedOutputs: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return apiError("Failed to fetch projects", 500, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateBody(createProjectSchema, body);
    if ("error" in validation) {
      return apiError(validation.error, 400);
    }
    const project = await prisma.project.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        color: validation.data.color,
        icon: validation.data.icon,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return apiError("Failed to create project", 500, error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, feedbackSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateBody(feedbackSchema, body);
    if ("error" in validation) {
      return apiError(validation.error, 400);
    }
    const output = await prisma.generatedOutput.update({
      where: { id },
      data: { feedbackStatus: validation.data.feedbackStatus },
    });
    return NextResponse.json(output);
  } catch (error) {
    return apiError("Failed to update feedback", 500, error);
  }
}

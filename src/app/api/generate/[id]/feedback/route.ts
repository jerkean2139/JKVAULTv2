import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { feedbackStatus } = await request.json();
    const output = await prisma.generatedOutput.update({
      where: { id },
      data: { feedbackStatus },
    });
    return NextResponse.json(output);
  } catch (error) {
    console.error("POST feedback error:", error);
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}

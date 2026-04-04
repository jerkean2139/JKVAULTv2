import { NextResponse } from "next/server";
import { generateDailyIdeas } from "@/services/ai/generator";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Get methodology settings for context
    const methodologySetting = await prisma.appSetting.findUnique({
      where: { key: "methodology" },
    });
    const settings = methodologySetting?.valueJson as Record<string, unknown> | undefined;

    const ideas = await generateDailyIdeas(settings);
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("GET /api/ideas/daily error:", error);
    return NextResponse.json({ error: "Failed to generate daily ideas" }, { status: 500 });
  }
}

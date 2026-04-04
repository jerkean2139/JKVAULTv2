import { NextResponse } from "next/server";
import { generateDailyIdeas } from "@/services/ai/generator";
import prisma from "@/lib/db";
import { apiError } from "@/lib/api-utils";

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
    return apiError("Failed to generate daily ideas", 500, error);
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { refreshAndStoreTrends } from "@/services/trends/trend-service";
import { apiError } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicArea = searchParams.get("topicArea");

    const where = topicArea ? { topicArea } : {};
    const trends = await prisma.trendTopic.findMany({
      where,
      orderBy: [{ score: "desc" }],
    });

    return NextResponse.json(trends);
  } catch (error) {
    return apiError("Failed to fetch trends", 500, error);
  }
}

export async function POST() {
  try {
    const count = await refreshAndStoreTrends();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return apiError("Failed to refresh trends", 500, error);
  }
}

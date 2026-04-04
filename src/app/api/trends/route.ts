import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { refreshAndStoreTrends } from "@/services/trends/trend-service";

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
    console.error("GET /api/trends error:", error);
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const count = await refreshAndStoreTrends();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("POST /api/trends error:", error);
    return NextResponse.json({ error: "Failed to refresh trends" }, { status: 500 });
  }
}

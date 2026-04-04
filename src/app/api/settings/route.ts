import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.appSetting.findMany();
    const result: Record<string, unknown> = {};
    for (const s of settings) {
      result[s.key] = s.valueJson;
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.settings) {
      // Batch update multiple settings
      for (const [key, value] of Object.entries(body.settings)) {
        await prisma.appSetting.upsert({
          where: { key },
          update: { valueJson: value as object },
          create: { key, valueJson: value as object },
        });
      }
    } else if (body.key && body.value !== undefined) {
      // Single setting update
      await prisma.appSetting.upsert({
        where: { key: body.key },
        update: { valueJson: body.value },
        create: { key: body.key, valueJson: body.value },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

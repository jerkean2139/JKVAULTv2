import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { apiError } from "@/lib/api-utils";

const MAX_KEY_LENGTH = 200;

function validateSettingsKeys(keys: string[]): string | null {
  for (const key of keys) {
    if (typeof key !== "string" || key.length === 0 || key.length > MAX_KEY_LENGTH) {
      return `Setting key must be a non-empty string of at most ${MAX_KEY_LENGTH} characters`;
    }
  }
  return null;
}

export async function GET() {
  try {
    const settings = await prisma.appSetting.findMany();
    const result: Record<string, unknown> = {};
    for (const s of settings) {
      result[s.key] = s.valueJson;
    }
    return NextResponse.json(result);
  } catch (error) {
    return apiError("Failed to fetch settings", 500, error);
  }
}

export async function POST(request: NextRequest) {
  return handleUpsert(request);
}

export async function PUT(request: NextRequest) {
  return handleUpsert(request);
}

async function handleUpsert(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.settings) {
      const keys = Object.keys(body.settings);
      const keyError = validateSettingsKeys(keys);
      if (keyError) return apiError(keyError, 400);

      for (const [key, value] of Object.entries(body.settings)) {
        await prisma.appSetting.upsert({
          where: { key },
          update: { valueJson: value as object },
          create: { key, valueJson: value as object },
        });
      }
    } else if (body.key && body.value !== undefined) {
      const keyError = validateSettingsKeys([body.key]);
      if (keyError) return apiError(keyError, 400);

      await prisma.appSetting.upsert({
        where: { key: body.key },
        update: { valueJson: body.value },
        create: { key: body.key, valueJson: body.value },
      });
    } else {
      const keys = Object.keys(body);
      const keyError = validateSettingsKeys(keys);
      if (keyError) return apiError(keyError, 400);

      for (const [key, value] of Object.entries(body)) {
        await prisma.appSetting.upsert({
          where: { key },
          update: { valueJson: value as object },
          create: { key, valueJson: value as object },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError("Failed to update settings", 500, error);
  }
}

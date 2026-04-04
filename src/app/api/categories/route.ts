import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { apiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { contentItemCategories: true } } },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return apiError("Failed to fetch categories", 500, error);
  }
}

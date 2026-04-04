import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateBody, createNoteSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-utils";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const notes = await prisma.note.findMany({
      where: { contentItemId: id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    return apiError("Failed to fetch notes", 500, error);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const raw = await request.json();
    const parsed = validateBody(createNoteSchema, raw);
    if ("error" in parsed) {
      return apiError(parsed.error, 400);
    }

    const { body: noteBody } = parsed.data;
    const note = await prisma.note.create({
      data: { contentItemId: id, body: noteBody },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return apiError("Failed to create note", 500, error);
  }
}

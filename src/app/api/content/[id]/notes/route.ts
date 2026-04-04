import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const notes = await prisma.note.findMany({
      where: { contentItemId: id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET notes error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { body: noteBody } = await request.json();
    const note = await prisma.note.create({
      data: { contentItemId: id, body: noteBody },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST notes error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

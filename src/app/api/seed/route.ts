import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Seeds the database with initial data.
 * Only works if no users exist yet (first-time setup).
 * Supports both GET (visit in browser) and POST.
 */
async function seedDatabase() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json({ message: "Database already seeded - you're good to go!", alreadySeeded: true });
    }

    // Create default admin user
    const passwordHash = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: { email: "admin@studio.com", passwordHash, name: "Admin" },
    });

    // Create default categories
    const categoryNames = [
      "Sales", "Marketing", "Leadership", "Systems", "Operations",
      "Mindset", "AI", "Prompting", "Storytelling", "Content Strategy",
      "Scaling", "Productivity", "Finance",
    ];
    for (const name of categoryNames) {
      await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }

    // Create default projects
    const projects = [
      { name: "Kean on Biz", description: "Business coaching and strategy content", color: "#6366f1" },
      { name: "Zenoflo", description: "Mindset, flow state, and personal development", color: "#8b5cf6" },
      { name: "Agent Mob", description: "Insurance agent community and training", color: "#ec4899" },
      { name: "Manumation", description: "Manual + automation systems and processes", color: "#14b8a6" },
    ];
    for (const p of projects) {
      await prisma.project.upsert({
        where: { name: p.name },
        update: {},
        create: p,
      });
    }

    return NextResponse.json({ success: true, message: "Database seeded! Login with admin@studio.com / admin123" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}

// GET so you can just visit /api/seed in your browser
export async function GET() {
  return seedDatabase();
}

// POST for programmatic access
export async function POST() {
  return seedDatabase();
}

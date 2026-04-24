import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional().nullable(),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL"]),
  beforeImageUrl: z.string().url(),
  afterImageUrl: z.string().url(),
  matchPercentage: z.number().int().min(0).max(100).optional().nullable()
});

export async function GET() {
  const entries = await prisma.galleryEntry.findMany({
    orderBy: [{ lastEdited: "desc" }]
  });
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const created = await prisma.galleryEntry.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category,
      beforeImageUrl: parsed.data.beforeImageUrl,
      afterImageUrl: parsed.data.afterImageUrl,
      matchPercentage: parsed.data.matchPercentage ?? null
    }
  });

  return NextResponse.json({ entry: created }, { status: 201 });
}


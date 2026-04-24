import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().min(2).max(50),
  beforeImage: z.string().url(),
  afterImage: z.string().url(),
  matchScore: z.number().int().min(0).max(100).optional().nullable(),
  isFeatured: z.boolean().optional().default(false)
});

export async function GET() {
  const entries = await prisma.portfolioEntry.findMany({
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }]
  });
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const created = await prisma.portfolioEntry.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category,
      beforeImage: parsed.data.beforeImage,
      afterImage: parsed.data.afterImage,
      matchScore: parsed.data.matchScore ?? null,
      isFeatured: parsed.data.isFeatured ?? false
    }
  });
  return NextResponse.json({ entry: created }, { status: 201 });
}


import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().min(2).max(50).optional(),
  beforeImage: z.string().url().optional(),
  afterImage: z.string().url().optional(),
  matchScore: z.number().int().min(0).max(100).optional().nullable(),
  isFeatured: z.boolean().optional()
});

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const updated = await prisma.portfolioEntry.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      ...(parsed.data.category !== undefined ? { category: parsed.data.category } : {}),
      ...(parsed.data.beforeImage !== undefined ? { beforeImage: parsed.data.beforeImage } : {}),
      ...(parsed.data.afterImage !== undefined ? { afterImage: parsed.data.afterImage } : {}),
      ...(parsed.data.matchScore !== undefined ? { matchScore: parsed.data.matchScore } : {}),
      ...(parsed.data.isFeatured !== undefined ? { isFeatured: parsed.data.isFeatured } : {})
    }
  });

  return NextResponse.json({ entry: updated });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.portfolioEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


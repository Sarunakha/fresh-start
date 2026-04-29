import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) return Response.json({ heroBanner: null });
  try {
    const row = await prisma.siteContent.findUnique({ where: { id: "hero-banner" } });
    if (!row) return Response.json({ heroBanner: null });
    return Response.json({
      heroBanner: { headline: row.headline, subtext: row.subtext, updatedAt: row.updatedAt.toISOString() }
    });
  } catch {
    return Response.json({ heroBanner: null });
  }
}


import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ services: [] });
  }

  let services: Awaited<ReturnType<typeof prisma.service.findMany>>;
  try {
    services = await prisma.service.findMany({
      where: { isVisible: true },
      orderBy: [{ priceSort: "asc" }, { name: "asc" }]
    });
  } catch {
    return Response.json({ services: [] });
  }

  return Response.json({
    services: services.map((s) => ({
      id: s.id,
      slug: slugify(`${(s as any).type ?? "PACKAGE"}-${s.name}`) || s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      priceRange: s.priceRange,
      showPrice: s.showPrice,
      features: s.features ?? [],
      sortOrder: (s as any).priceSort ?? 0
    }))
  });
}


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
  const services = await prisma.service.findMany({
    where: { isVisible: true },
    orderBy: [{ priceSort: "asc" }, { name: "asc" }]
  });

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


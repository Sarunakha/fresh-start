import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ reviews: [] });
  }

  let reviews: Awaited<ReturnType<typeof prisma.clientReview.findMany>>;
  try {
    reviews = await prisma.clientReview.findMany({
      where: { isVisible: true },
      orderBy: [{ createdAt: "desc" }]
    });
  } catch {
    return Response.json({ reviews: [] });
  }

  return Response.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      clientName: r.clientName,
      role: r.role,
      reviewText: r.reviewText,
      rating: r.rating
    }))
  });
}


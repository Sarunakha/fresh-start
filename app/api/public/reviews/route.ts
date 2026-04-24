import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.clientReview.findMany({
    where: { isVisible: true },
    orderBy: [{ createdAt: "desc" }]
  });

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


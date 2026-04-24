"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getPortfolioEntries() {
  return prisma.portfolioEntry.findMany({
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }]
  });
}

export async function createPortfolioEntry(input: {
  title: string;
  description?: string | null;
  category: string;
  beforeImage: string;
  afterImage: string;
  matchScore?: number | null;
  isFeatured?: boolean;
}) {
  await prisma.portfolioEntry.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      category: input.category,
      beforeImage: input.beforeImage,
      afterImage: input.afterImage,
      matchScore: input.matchScore ?? null,
      isFeatured: input.isFeatured ?? false
    }
  });

  revalidatePath("/admin/gallery");
}

export async function deletePortfolioEntry(id: string) {
  await prisma.portfolioEntry.delete({ where: { id } });
  revalidatePath("/admin/gallery");
}

export async function toggleFeaturedPortfolioEntry(id: string, isFeatured: boolean) {
  await prisma.portfolioEntry.update({
    where: { id },
    data: { isFeatured }
  });
  revalidatePath("/admin/gallery");
}


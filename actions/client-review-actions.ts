"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllReviews() {
  return prisma.clientReview.findMany({
    orderBy: [{ createdAt: "desc" }]
  });
}

export async function getPublicReviews() {
  return prisma.clientReview.findMany({
    where: { isVisible: true },
    orderBy: [{ createdAt: "desc" }]
  });
}

export async function addReview(formData: FormData | any) {
  const get = (k: string) =>
    formData instanceof FormData ? formData.get(k) : formData?.[k];

  const clientName = String(get("clientName") ?? "").trim();
  const role = String(get("role") ?? "").trim();
  const reviewText = String(get("reviewText") ?? "").trim();
  const ratingRaw = String(get("rating") ?? "5").trim();
  const rating = Math.max(1, Math.min(5, Number(ratingRaw || 5)));

  if (!clientName || !reviewText) throw new Error("Missing required fields");

  await prisma.clientReview.create({
    data: {
      clientName,
      role: role ? role : null,
      reviewText,
      rating: Number.isFinite(rating) ? rating : 5,
      isVisible: true
    }
  });

  revalidatePath("/reviews");
  revalidatePath("/admin/clients");
}

export async function updateReviewVisibility(id: string, isVisible: boolean) {
  await prisma.clientReview.update({
    where: { id },
    data: { isVisible }
  });
  revalidatePath("/reviews");
  revalidatePath("/admin/clients");
}

export async function deleteReview(id: string) {
  await prisma.clientReview.delete({ where: { id } });
  revalidatePath("/reviews");
  revalidatePath("/admin/clients");
}


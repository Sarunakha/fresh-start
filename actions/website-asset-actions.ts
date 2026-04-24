"use server";

import { prisma } from "@/lib/prisma";
import { toOptimizedCloudinaryUrl } from "@/lib/cloudinary-delivery";
import { revalidatePath } from "next/cache";

function revalidateWebsitePages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/reviews");
  revalidatePath("/admin/gallery");
}

export async function getAllWebsiteAssets() {
  return prisma.websiteAsset.findMany({
    orderBy: { sectionKey: "asc" }
  });
}

export async function upsertWebsiteAsset(input: {
  sectionKey: string;
  cloudinaryUrl: string;
  altText?: string;
}) {
  const sectionKey = input.sectionKey.trim();
  const cloudinaryUrl = toOptimizedCloudinaryUrl(input.cloudinaryUrl.trim());
  const altText =
    input.altText?.trim() || "Fresh Start Facility Solutions Sydney Image";

  if (!sectionKey || !cloudinaryUrl) {
    throw new Error("sectionKey and cloudinaryUrl are required");
  }

  await prisma.websiteAsset.upsert({
    where: { sectionKey },
    create: { sectionKey, cloudinaryUrl, altText },
    update: { cloudinaryUrl, altText }
  });

  revalidateWebsitePages();
}

export async function deleteWebsiteAsset(sectionKey: string) {
  const key = sectionKey.trim();
  if (!key) throw new Error("sectionKey required");
  await prisma.websiteAsset.deleteMany({ where: { sectionKey: key } });
  revalidateWebsitePages();
}

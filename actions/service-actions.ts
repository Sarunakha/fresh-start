"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getServices(isAdmin = false) {
  return prisma.service.findMany({
    ...(isAdmin ? {} : { where: { isVisible: true } }),
    orderBy: [{ priceSort: "asc" }, { name: "asc" }]
  });
}

function normalizePayload(input: FormData | any) {
  const get = (k: string) =>
    input instanceof FormData ? input.get(k) : input?.[k];

  const featuresRaw = String(get("features") ?? get("featuresText") ?? "").trim();
  const features = featuresRaw
    ? featuresRaw
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean)
    : Array.isArray(get("features"))
      ? (get("features") as string[])
      : [];

  const priceSortRaw = String(get("priceSort") ?? "").trim();
  const priceSort = priceSortRaw ? Number(priceSortRaw) : 0;

  return {
    id: String(get("id") ?? "").trim() || undefined,
    name: String(get("name") ?? "").trim(),
    category: String(get("category") ?? "").trim(),
    type: String(get("type") ?? "PACKAGE").trim(),
    description: String(get("description") ?? "").trim() || null,
    priceRange: String(get("priceRange") ?? "").trim(),
    priceSort: Number.isFinite(priceSort) ? priceSort : 0,
    features,
    isPopular: String(get("isPopular") ?? "") === "true" || get("isPopular") === true,
    isVisible: String(get("isVisible") ?? "") === "false" ? false : Boolean(get("isVisible") ?? true),
    showPrice: String(get("showPrice") ?? "") === "false" ? false : Boolean(get("showPrice") ?? true)
  };
}

export async function upsertService(formData: FormData | any) {
  const p = normalizePayload(formData);
  if (!p.name || !p.category || !p.priceRange) throw new Error("Missing required fields");

  if (p.id) {
    await prisma.service.update({
      where: { id: p.id },
      data: {
        name: p.name,
        category: p.category,
        type: p.type,
        description: p.description,
        priceRange: p.priceRange,
        priceSort: p.priceSort,
        features: p.features,
        isPopular: p.isPopular,
        isVisible: p.isVisible,
        showPrice: p.showPrice
      }
    });
  } else {
    await prisma.service.create({
      data: {
        name: p.name,
        category: p.category,
        type: p.type,
        description: p.description,
        priceRange: p.priceRange,
        priceSort: p.priceSort,
        features: p.features,
        isPopular: p.isPopular,
        isVisible: p.isVisible,
        showPrice: p.showPrice
      }
    });
  }

  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function toggleVisibility(id: string, currentStatus: boolean) {
  await prisma.service.update({
    where: { id },
    data: { isVisible: !currentStatus }
  });
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/services");
  revalidatePath("/admin/services");
}


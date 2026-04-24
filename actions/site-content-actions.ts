"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  if (!raw) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(raw);
}

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");
  await jwtVerify(token, getSecret());
}

function clamp(s: string, max: number) {
  const t = (s ?? "").trim();
  return t.length > max ? t.slice(0, max) : t;
}

export type BannerContent = {
  headline: string;
  subtext: string;
  updatedAt: string;
};

export async function getHeroBanner(): Promise<BannerContent | null> {
  const row = await prisma.siteContent.findUnique({ where: { id: "hero-banner" } });
  if (!row) return null;
  return { headline: row.headline, subtext: row.subtext, updatedAt: row.updatedAt.toISOString() };
}

export async function updateHeroBanner(headline: string, subtext: string) {
  await requireAdmin();
  const h = clamp(headline, 80);
  const s = clamp(subtext, 160);
  if (!h || !s) throw new Error("Headline and subtext are required");

  await prisma.siteContent.upsert({
    where: { id: "hero-banner" },
    update: { headline: h, subtext: s },
    create: { id: "hero-banner", headline: h, subtext: s }
  });

  revalidatePath("/");
  revalidatePath("/admin/marketing");
}


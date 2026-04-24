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

export async function getAddOnsAdmin() {
  await requireAdmin();
  return prisma.addOn.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function upsertAddOn(input: {
  id?: string;
  key: string;
  name: string;
  priceRange: string;
  sortOrder?: number;
  active?: boolean;
}) {
  await requireAdmin();
  const key = String(input.key ?? "").trim();
  const name = String(input.name ?? "").trim();
  const priceRange = String(input.priceRange ?? "").trim();
  const sortOrder = Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 0;
  const active = input.active ?? true;

  if (!key || !name || !priceRange) throw new Error("Missing required fields");

  const saved = input.id
    ? await prisma.addOn.update({
        where: { id: input.id },
        data: { key, name, priceRange, sortOrder, active }
      })
    : await prisma.addOn.upsert({
        where: { key },
        update: { name, priceRange, sortOrder, active },
        create: { key, name, priceRange, sortOrder, active }
      });

  revalidatePath("/services");
  revalidatePath("/get-a-quote");
  revalidatePath("/admin/services");
  return saved;
}

export async function deleteAddOn(id: string) {
  await requireAdmin();
  await prisma.addOn.delete({ where: { id } });
  revalidatePath("/services");
  revalidatePath("/get-a-quote");
  revalidatePath("/admin/services");
}

export async function toggleAddOnActive(id: string, current: boolean) {
  await requireAdmin();
  await prisma.addOn.update({ where: { id }, data: { active: !current } });
  revalidatePath("/services");
  revalidatePath("/get-a-quote");
  revalidatePath("/admin/services");
}


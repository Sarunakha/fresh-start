"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

const QUOTE_STATUSES = ["New Lead", "Contacted", "Quoted"] as const;
type QuoteStatus = (typeof QUOTE_STATUSES)[number];

const MAX_LEN = 500;

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

function clamp(s: string, max = MAX_LEN) {
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type QuoteWizardPayload = {
  spaceType: string;
  approximateSize: string;
  frequency: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  addOnKeys?: string[];
};

export type SubmitQuoteResult = { ok: true } | { ok: false; error: string };

/** Public: creates a quote lead from the marketing wizard. */
export async function submitQuoteRequest(data: QuoteWizardPayload): Promise<SubmitQuoteResult> {
  const spaceType = clamp(data.spaceType ?? "");
  const approximateSize = clamp(data.approximateSize ?? "");
  const frequency = clamp(data.frequency ?? "");
  const contactName = clamp(data.contactName ?? "");
  const contactEmail = clamp(data.contactEmail ?? "").toLowerCase();
  const contactPhone = data.contactPhone ? clamp(data.contactPhone, 80) : "";
  const addOnKeys = Array.from(
    new Set((data.addOnKeys ?? []).map((k) => clamp(k, 80)).filter(Boolean))
  ).slice(0, 20);

  if (!spaceType || !approximateSize || !frequency || !contactName || !contactEmail) {
    return { ok: false, error: "Please complete all required fields." };
  }
  if (!isValidEmail(contactEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  try {
    const addOns = addOnKeys.length
      ? await prisma.addOn.findMany({
          where: { key: { in: addOnKeys }, active: true },
          select: { id: true }
        })
      : [];

    await prisma.quoteRequest.create({
      data: {
        spaceType,
        approximateSize,
        frequency,
        contactName,
        contactEmail,
        contactPhone: contactPhone || null,
        status: "New Lead",
        addOns: addOns.length ? { create: addOns.map((a) => ({ addOnId: a.id })) } : undefined
      }
    });
    revalidatePath("/admin/quotes");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unable to submit your quote request. Please try again." };
  }
}

/** Admin: all quote requests, newest first. */
export async function getQuoteRequests() {
  await requireAdmin();
  return prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { addOns: { include: { addOn: true } } }
  });
}

/** Admin: update pipeline status. */
export async function updateQuoteStatus(id: string, status: string) {
  await requireAdmin();
  const next = status.trim();
  if (!(QUOTE_STATUSES as readonly string[]).includes(next)) {
    throw new Error("Invalid status");
  }
  const current = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!current) throw new Error("Not found");

  await prisma.quoteRequest.update({
    where: { id },
    data: { status: next as QuoteStatus }
  });

  if (current.status !== next) {
    await prisma.quoteRequestStatusHistory.create({
      data: {
        quoteRequestId: id,
        fromStatus: current.status,
        toStatus: next
      }
    });
  }
  revalidatePath("/admin/quotes");
}

export async function getQuoteStatusHistory(id: string) {
  await requireAdmin();
  return prisma.quoteRequestStatusHistory.findMany({
    where: { quoteRequestId: id },
    orderBy: { createdAt: "asc" }
  });
}

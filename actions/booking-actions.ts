"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";
import { BookingStatus } from "@prisma/client";

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

export async function submitBooking(_prevState: unknown, formData: FormData) {
  const primaryContactName = String(formData.get("primaryContactName") ?? "").trim();
  const serviceSuburb = String(formData.get("serviceSuburb") ?? "").trim();
  const serviceCategory = String(formData.get("serviceCategory") ?? "").trim();
  const preferredDateRaw = String(formData.get("preferredDate") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();

  if (!primaryContactName || !serviceSuburb || !serviceCategory || !preferredDateRaw) {
    return { ok: false as const, error: "Please complete all required fields." };
  }

  const preferredDate = new Date(preferredDateRaw);
  if (Number.isNaN(preferredDate.getTime())) {
    return { ok: false as const, error: "Preferred arrival date is invalid." };
  }

  try {
    await prisma.bookingRequest.create({
      data: {
        primaryContactName,
        serviceSuburb,
        serviceCategory,
        preferredDate,
        notes: notesRaw ? notesRaw : null,
        status: "Pending Review"
      }
    });

    revalidatePath("/admin/bookings");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Unable to submit request. Please try again." };
  }
}

export async function getBookings() {
  await requireAdmin();
  return prisma.booking.findMany({
    orderBy: [{ createdAt: "desc" }]
  });
}

export async function updateBookingStatus(id: string, newStatus: string) {
  await requireAdmin();
  if (!(Object.values(BookingStatus) as string[]).includes(newStatus)) {
    throw new Error("Invalid status");
  }
  await prisma.booking.update({
    where: { id },
    data: { status: newStatus as BookingStatus }
  });
  revalidatePath("/admin/bookings");
}

export async function createManualBooking(formData: FormData) {
  await requireAdmin();

  const primaryContactName = String(formData.get("primaryContactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const serviceSuburb = String(formData.get("serviceSuburb") ?? "").trim();
  const serviceCategory = String(formData.get("serviceCategory") ?? "").trim();
  const preferredArrivalDateRaw = String(formData.get("preferredArrivalDate") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();

  if (!primaryContactName || !serviceSuburb || !serviceCategory) {
    return { ok: false as const, error: "Please complete all required fields." };
  }

  const preferredArrivalDate = preferredArrivalDateRaw ? new Date(preferredArrivalDateRaw) : null;
  if (preferredArrivalDate && Number.isNaN(preferredArrivalDate.getTime())) {
    return { ok: false as const, error: "Preferred arrival date is invalid." };
  }

  await prisma.booking.create({
    data: {
      primaryContactName,
      email,
      serviceSuburb,
      serviceCategory,
      preferredArrivalDate: preferredArrivalDate ?? undefined,
      notes: notesRaw ? notesRaw : null,
      status: "NEW"
    }
  });

  revalidatePath("/admin/bookings");
  return { ok: true as const };
}


import { prisma } from "@/lib/prisma";

type CreateBookingBody = {
  primaryContactName?: string;
  email?: string;
  serviceSuburb?: string;
  serviceCategory?: string;
  preferredArrivalDate?: string;
  notes?: string;
};

function clamp(s: unknown, max: number) {
  const t = String(s ?? "").trim();
  return t.length > max ? t.slice(0, max) : t;
}

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Service temporarily unavailable" }, { status: 503 });
  }

  const json = (await req.json().catch(() => null)) as CreateBookingBody | null;
  if (!json) return Response.json({ error: "Invalid request body" }, { status: 400 });

  const primaryContactName = clamp(json.primaryContactName, 120);
  const email = clamp(json.email, 200).toLowerCase();
  const serviceSuburb = clamp(json.serviceSuburb, 120);
  const serviceCategory = clamp(json.serviceCategory, 120);
  const preferredArrivalDateRaw = clamp(json.preferredArrivalDate, 40);
  const notes = clamp(json.notes, 2000);

  if (!primaryContactName || !email || !serviceSuburb || !serviceCategory) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const preferredDate = preferredArrivalDateRaw ? new Date(preferredArrivalDateRaw) : null;
  if (preferredDate && Number.isNaN(preferredDate.getTime())) {
    return Response.json({ error: "Invalid preferred arrival date" }, { status: 400 });
  }

  // Store as BookingRequest (pending review). Email is kept in notes for now (schema doesn't include email).
  try {
    const created = await prisma.bookingRequest.create({
      data: {
        primaryContactName,
        serviceSuburb,
        serviceCategory,
        preferredDate: preferredDate ?? new Date(),
        notes: [notes, `Email: ${email}`].filter(Boolean).join("\n\n") || null,
        status: "Pending Review"
      }
    });

    return Response.json({ booking: { id: created.id } }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to submit booking request" }, { status: 500 });
  }
}


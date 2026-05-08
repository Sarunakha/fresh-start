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

function toUtcDateKey(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDateKey(raw: string) {
  // Accept "YYYY-MM-DD" (from <input type="date">) or a full ISO string.
  const trimmed = raw.trim();
  const key = trimmed.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  return key;
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

  const preferredDateKey = preferredArrivalDateRaw ? parseDateKey(preferredArrivalDateRaw) : null;
  if (!preferredDateKey) {
    return Response.json({ error: "Preferred arrival date is required" }, { status: 400 });
  }
  const todayKey = toUtcDateKey(new Date());
  if (preferredDateKey < todayKey) {
    return Response.json({ error: "Preferred arrival date cannot be in the past" }, { status: 400 });
  }
  const preferredDate = new Date(`${preferredDateKey}T00:00:00.000Z`);

  // Store as BookingRequest (pending review). Email is kept in notes for now (schema doesn't include email).
  try {
    const created = await prisma.bookingRequest.create({
      data: {
        primaryContactName,
        serviceSuburb,
        serviceCategory,
        preferredDate,
        notes: [notes, `Email: ${email}`].filter(Boolean).join("\n\n") || null,
        status: "Pending Review"
      }
    });

    return Response.json({ booking: { id: created.id } }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to submit booking request" }, { status: 500 });
  }
}


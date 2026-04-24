import { prisma } from "@/lib/prisma";
import { BookingsClient } from "./ui/BookingsClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
            INBOUND REQUESTS
          </div>
          <div className="mt-2 text-3xl font-semibold text-white">Booking Management</div>
        </div>
        <Link
          href="/admin/bookings/new"
          className="rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white border border-white/10"
        >
          + New Manual Entry
        </Link>
      </div>

      <BookingsClient
        initial={bookings.map((b) => ({
          id: b.id,
          primaryContactName: b.primaryContactName,
          email: (b as any).email ?? "",
          serviceSuburb: b.serviceSuburb,
          serviceCategory: b.serviceCategory,
          preferredArrivalDate: b.preferredArrivalDate ? b.preferredArrivalDate.toISOString() : null,
          notes: b.notes ?? null,
          status: b.status,
          createdAt: b.createdAt.toISOString()
        }))}
      />
    </div>
  );
}


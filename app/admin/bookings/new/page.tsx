"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createManualBooking } from "@/actions/booking-actions";

export default function AdminNewBookingPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createManualBooking(formData);
      if (!res.ok) {
        setError(res.error ?? "Unable to create booking.");
        return;
      }
      router.replace("/admin/bookings");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
          MANUAL ENTRY
        </div>
        <div className="mt-2 text-3xl font-semibold text-white">Create Booking</div>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-w-2xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm p-6 space-y-5"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
              CLIENT NAME *
            </label>
            <input
              name="primaryContactName"
              required
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300/50 focus:border-white/30"
              placeholder="e.g. Alex Smith"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
              EMAIL
            </label>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300/50 focus:border-white/30"
              placeholder="e.g. client@email.com"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
              LOCATION (SUBURB) *
            </label>
            <input
              name="serviceSuburb"
              required
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300/50 focus:border-white/30"
              placeholder="e.g. Parramatta"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
              SERVICE PROTOCOL *
            </label>
            <input
              name="serviceCategory"
              required
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300/50 focus:border-white/30"
              placeholder="e.g. End of Lease"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
            PREFERRED ARRIVAL DATE
          </label>
          <input
            name="preferredArrivalDate"
            type="date"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
            NOTES
          </label>
          <textarea
            name="notes"
            rows={4}
            className="w-full resize-none rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300/50 focus:border-white/30"
            placeholder="Optional notes…"
          />
        </div>

        {error ? (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 border border-red-500/20">
            {error}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#99F6E4] px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#7cf0dc] disabled:opacity-60"
          >
            {pending ? "Creating…" : "Create Booking"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/bookings")}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white/10 px-5 text-sm font-semibold text-slate-200 hover:bg-white/15 border border-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


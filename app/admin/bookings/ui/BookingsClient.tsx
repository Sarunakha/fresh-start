"use client";

import { useMemo, useState, useTransition } from "react";
import { updateBookingStatus } from "@/actions/booking-actions";
import { CalendarDays, ChevronLeft, ChevronRight, List } from "lucide-react";

type BookingRow = {
  id: string;
  primaryContactName: string;
  email: string;
  serviceSuburb: string;
  serviceCategory: string;
  preferredArrivalDate: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
};

function startOfWeek(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // Monday=0
  copy.setDate(copy.getDate() - diff);
  return copy;
}

function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function shortDay(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function shortMonthDay(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function StatusPill({ status }: { status: string }) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  if (status === "CONFIRMED") return <span className={`${base} bg-[#D1EAD8] text-emerald-900`}>Confirmed</span>;
  if (status === "COMPLETED") return <span className={`${base} bg-emerald-500/15 text-emerald-200`}>Completed</span>;
  if (status === "IN_PROGRESS") return <span className={`${base} bg-sky-500/15 text-sky-100`}>In Progress</span>;
  if (status === "CANCELLED") return <span className={`${base} bg-red-500/15 text-red-100`}>Cancelled</span>;
  return <span className={`${base} bg-amber-500/15 text-amber-100`}>New</span>;
}

function fmtDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function bookingDate(b: BookingRow) {
  const raw = b.preferredArrivalDate ?? b.createdAt;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function protocolLane(serviceCategory: string) {
  const s = (serviceCategory ?? "").toLowerCase();
  if (s.includes("deep") || s.includes("end") || s.includes("clinical")) return "Clinical Restorations";
  return "General Cleans";
}

export function BookingsClient({ initial }: { initial: BookingRow[] }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<BookingRow[]>(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "calendar">("calendar");
  const [weekStart, setWeekStart] = useState(() => {
    const today = startOfToday();
    const upcoming = initial
      .map((b) => bookingDate(b))
      .filter((d) => d.getTime() >= today.getTime())
      .sort((a, b) => a.getTime() - b.getTime())[0];
    return startOfWeek(upcoming ?? today);
  });

  const selected = useMemo(
    () => (selectedId ? items.find((x) => x.id === selectedId) ?? null : null),
    [items, selectedId]
  );

  function changeStatus(id: string, newStatus: string) {
    startTransition(async () => {
      await updateBookingStatus(id, newStatus);
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
    });
  }

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-xs text-slate-200/55">
          Weekly view shows upcoming appointments by protocol lane.
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {view === "calendar" ? (
            <div className="inline-flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setWeekStart((d) => addDays(d, -7))}
                className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-200/75 hover:text-white hover:bg-white/10"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setWeekStart(startOfWeek(startOfToday()))}
                className="px-4 py-2.5 text-sm font-semibold text-slate-200/75 hover:text-white hover:bg-white/10"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setWeekStart((d) => addDays(d, 7))}
                className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-200/75 hover:text-white hover:bg-white/10"
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <div className="inline-flex overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${
              view === "calendar" ? "bg-white/10 text-white" : "text-slate-200/70 hover:text-white"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Calendar
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${
              view === "table" ? "bg-white/10 text-white" : "text-slate-200/70 hover:text-white"
            }`}
          >
            <List className="h-4 w-4" />
            Table
          </button>
        </div>
        </div>
      </div>

      {view === "calendar" ? (
        (() => {
          const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
          const lanes = ["Clinical Restorations", "General Cleans"] as const;

          const byLane = (lane: (typeof lanes)[number]) =>
            items
              .filter((b) => protocolLane(b.serviceCategory) === lane)
              .slice()
              .sort((a, b) => bookingDate(a).getTime() - bookingDate(b).getTime());

          return (
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm overflow-hidden">
              <div className="min-h-[520px] w-full">
              <div className="grid grid-cols-[220px_repeat(7,minmax(180px,1fr))] border-b border-white/10 bg-[#0B1220]/40">
                <div className="px-5 py-4 text-xs font-semibold tracking-[0.28em] text-slate-200/60">
                  PROTOCOL
                </div>
                {days.map((d) => (
                  <div key={d.toISOString()} className="px-4 py-4">
                    <div className="text-xs font-semibold text-slate-200/70">
                      {shortDay(d)}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {shortMonthDay(d)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divide-y divide-white/10">
                {lanes.map((lane) => {
                  const laneItems = byLane(lane);
                  return (
                    <div
                      key={lane}
                      className="grid grid-cols-[220px_repeat(7,minmax(180px,1fr))]"
                    >
                      <div className="px-5 py-5">
                        <div className="text-sm font-semibold text-white">{lane}</div>
                        <div className="mt-1 text-xs text-slate-200/60">
                          {laneItems.length} this week
                        </div>
                      </div>
                      {days.map((d) => {
                        const events = laneItems.filter((b) => sameDay(bookingDate(b), d));
                        return (
                          <div key={d.toISOString()} className="px-4 py-4">
                            {events.length === 0 ? (
                              <div className="min-h-[132px] rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-3 py-3 text-xs text-slate-200/40">
                                —
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {events.slice(0, 4).map((b) => (
                                  <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => setSelectedId(b.id)}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left hover:bg-white/10 transition"
                                  >
                                    <div className="truncate text-sm font-semibold text-white">
                                      {b.primaryContactName}
                                    </div>
                                    <div className="mt-0.5 truncate text-xs text-slate-200/60">
                                      {b.serviceSuburb} • {b.serviceCategory}
                                    </div>
                                  </button>
                                ))}
                                {events.length > 4 ? (
                                  <div className="text-xs text-slate-200/55">
                                    +{events.length - 4} more
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          );
        })()
      ) : null}

      {view === "table" ? (
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-200/70">
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 font-semibold">Client Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Service Protocol</th>
                <th className="px-6 py-4 font-semibold">Requested Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-slate-200/70" colSpan={7}>
                    No bookings found.
                  </td>
                </tr>
              ) : (
                items.map((b) => (
                  <tr key={b.id} className="border-b border-white/5 last:border-b-0">
                    <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                      {b.primaryContactName}
                    </td>
                    <td className="px-6 py-4">
                      {b.email ? (
                        <a
                          href={`mailto:${b.email}`}
                          className="text-sm font-semibold text-slate-200 hover:text-[#99F6E4] whitespace-nowrap"
                        >
                          {b.email}
                        </a>
                      ) : (
                        <span className="text-slate-200/60">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{b.serviceSuburb}</td>
                    <td className="px-6 py-4">{b.serviceCategory}</td>
                    <td className="px-6 py-4">{fmtDate(b.preferredArrivalDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusPill status={b.status} />
                        <select
                          value={b.status}
                          onChange={(e) => changeStatus(b.id, e.target.value)}
                          disabled={pending}
                          className="rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2 text-xs text-slate-200 outline-none"
                        >
                          <option value="NEW">New</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <span className="text-xs text-slate-200/50">
                          {pending ? "Saving…" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedId(b.id)}
                        className="text-sm font-semibold text-slate-200 hover:text-[#99F6E4]"
                      >
                        Review Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : null}

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0B1220] text-slate-100 shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
                  BOOKING DETAILS
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {selected.primaryContactName}
                </div>
                <div className="mt-1 text-sm text-slate-200/70">
                  Submitted {fmtDate(selected.createdAt)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold tracking-wide text-slate-200/60">EMAIL</div>
                <div className="mt-2 text-sm font-semibold">
                  {selected.email ? (
                    <a className="text-[#99F6E4] hover:underline" href={`mailto:${selected.email}`}>
                      {selected.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold tracking-wide text-slate-200/60">STATUS</div>
                <div className="mt-2">
                  <StatusPill status={selected.status} />
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold tracking-wide text-slate-200/60">LOCATION</div>
                <div className="mt-2 text-sm font-semibold text-white">{selected.serviceSuburb}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold tracking-wide text-slate-200/60">SERVICE PROTOCOL</div>
                <div className="mt-2 text-sm font-semibold text-white">{selected.serviceCategory}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 md:col-span-2">
                <div className="text-xs font-semibold tracking-wide text-slate-200/60">PREFERRED ARRIVAL DATE</div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {fmtDate(selected.preferredArrivalDate)}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 md:col-span-2">
                <div className="text-xs font-semibold tracking-wide text-slate-200/60">CLIENT NOTES</div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-slate-100/90">
                  {selected.notes?.trim() ? selected.notes : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


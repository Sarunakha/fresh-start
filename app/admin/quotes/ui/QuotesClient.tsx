"use client";

import { useState, useTransition } from "react";
import { updateQuoteStatus } from "@/actions/quote-request-actions";
import { ChevronDown } from "lucide-react";

export type QuoteRow = {
  id: string;
  spaceType: string;
  approximateSize: string;
  frequency: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  status: string;
  addOns: Array<{
    id: string;
    key: string;
    name: string;
  }>;
  createdAt: string;
};

const STATUSES = ["New Lead", "Contacted", "Quoted"] as const;

function StatusBadge({ status }: { status: string }) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  if (status === "New Lead") {
    return (
      <span className={`${base} bg-[#0F766E] text-white ring-1 ring-[#A5E6DF]/60`}>New Lead</span>
    );
  }
  if (status === "Contacted") {
    return <span className={`${base} bg-slate-200/90 text-slate-800`}>Contacted</span>;
  }
  if (status === "Quoted") {
    return <span className={`${base} bg-[#A5E6DF]/40 text-[#0A1922]`}>Quoted</span>;
  }
  return <span className={`${base} bg-slate-100 text-slate-700`}>{status}</span>;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function QuotesClient({ initial }: { initial: QuoteRow[] }) {
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  function changeStatus(id: string, status: string) {
    setActionError(null);
    startTransition(async () => {
      try {
        await updateQuoteStatus(id, status);
        setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      } catch {
        setActionError("Could not update status. Please refresh and try again.");
      }
    });
  }

  return (
    <div className="space-y-4">
      {actionError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {actionError}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-[#0A1922]/8 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-[#0A1922]">
            <thead className="border-b border-[#0A1922]/10 bg-[#F9FAFB] text-left text-xs font-semibold uppercase tracking-wide text-[#0A1922]/55">
              <tr>
                <th className="px-5 py-3">Date &amp; time</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Space type</th>
                <th className="px-5 py-3">Size</th>
                <th className="px-5 py-3">Frequency</th>
                <th className="px-5 py-3">Add-ons</th>
                <th className="px-5 py-3 text-right">Status manager</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="px-5 py-12 text-center text-[#0A1922]/55" colSpan={9}>
                    No quote requests yet.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-[#0A1922]/6 transition-colors hover:bg-[#F9FAFB] last:border-0"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-[#0A1922]/80">
                      {fmtDate(r.createdAt)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0A1922]">{r.contactName}</td>
                    <td className="px-5 py-4">
                      <a
                        className="font-semibold text-[#0A1922]/80 hover:text-[#0A1922] hover:underline"
                        href={`mailto:${r.contactEmail}`}
                      >
                        {r.contactEmail}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      {r.contactPhone ? (
                        <a
                          className="font-semibold text-[#0A1922]/80 hover:text-[#0A1922] hover:underline"
                          href={`tel:${r.contactPhone}`}
                        >
                          {r.contactPhone}
                        </a>
                      ) : (
                        <span className="text-[#0A1922]/45">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">{r.spaceType}</td>
                    <td className="max-w-[140px] truncate px-5 py-4" title={r.approximateSize}>
                      {r.approximateSize}
                    </td>
                    <td className="max-w-[140px] truncate px-5 py-4" title={r.frequency}>
                      {r.frequency}
                    </td>
                    <td className="px-5 py-4 min-w-[260px]">
                      {r.addOns.length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {r.addOns.map((a) => (
                            <span
                              key={a.id}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 ring-1 ring-black/5"
                              title={a.key}
                            >
                              {a.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#0A1922]/45">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setOpenId((prev) => (prev === r.id ? null : r.id))}
                          className="inline-flex items-center gap-2 rounded-full px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A5E6DF]/60"
                          aria-haspopup="menu"
                          aria-expanded={openId === r.id}
                        >
                          <StatusBadge status={r.status} />
                          <ChevronDown className="h-4 w-4 text-[#0A1922]/55" />
                        </button>

                        {openId === r.id ? (
                          <div
                            role="menu"
                            className="absolute right-0 top-[calc(100%+10px)] z-20 w-44 overflow-hidden rounded-xl border border-[#0A1922]/10 bg-white shadow-lg"
                          >
                            <div className="px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-[#0A1922]/45">
                              SET STATUS
                            </div>
                            <div className="border-t border-[#0A1922]/10" />
                            {STATUSES.map((s) => {
                              const active = s === r.status;
                              return (
                                <button
                                  key={s}
                                  role="menuitem"
                                  type="button"
                                  disabled={pending}
                                  onClick={() => {
                                    setOpenId(null);
                                    if (!active) changeStatus(r.id, s);
                                  }}
                                  className={[
                                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm",
                                    active ? "bg-[#F9FAFB] font-semibold text-[#0A1922]" : "text-[#0A1922]/80 hover:bg-[#F9FAFB] hover:text-[#0A1922]",
                                    pending ? "opacity-60" : ""
                                  ].join(" ")}
                                >
                                  <span>{s}</span>
                                  {active ? <span className="text-xs text-[#0A1922]/45">Current</span> : null}
                                </button>
                              );
                            })}
                            {pending ? (
                              <div className="border-t border-[#0A1922]/10 px-3 py-2 text-xs text-[#0A1922]/50">
                                Saving…
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

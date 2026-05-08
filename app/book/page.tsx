"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ServiceMap } from "@/components/ServiceMap";

export default function BookPage() {
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceSuburb, setServiceSuburb] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [preferredArrivalDate, setPreferredArrivalDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<
    { ok: true; bookingId: string } | { ok: false; message: string } | null
  >(null);

  const completeness = useMemo(() => {
    const fields = [
      primaryContactName.trim().length > 0,
      email.trim().length > 0,
      serviceSuburb.trim().length > 0,
      serviceCategory.trim().length > 0,
      preferredArrivalDate.trim().length > 0,
      notes.trim().length > 0
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [email, notes, preferredArrivalDate, primaryContactName, serviceCategory, serviceSuburb]);

  const minDate = useMemo(() => {
    // Use local date (YYYY-MM-DD) so the browser date picker blocks past dates reliably.
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitResult(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryContactName,
          email,
          serviceSuburb,
          serviceCategory,
          preferredArrivalDate: preferredArrivalDate || undefined,
          notes: notes || undefined
        })
      });
      if (!res.ok) {
        setSubmitResult({ ok: false, message: "Booking request failed" });
        return;
      }
      const data = (await res.json()) as { booking: { id: string } };
      setSubmitResult({ ok: true, bookingId: data.booking.id });
      setPrimaryContactName("");
      setEmail("");
      setServiceSuburb("");
      setServiceCategory("");
      setPreferredArrivalDate("");
      setNotes("");
    } catch {
      setSubmitResult({ ok: false, message: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="bg-clinical-lavender py-16">
        <Container>
          <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
            CONCIERGE DESK
          </div>
          <h1 className="mt-4 text-5xl">Local Support for a Luminous Home.</h1>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <p className="max-w-md text-sm leading-6 text-clinical-charcoal/70">
              Our Sydney-based team ensures medical-grade precision in every corner. Reach out for bespoke
              industrial or residential scheduling.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl2 border border-black/5 bg-white p-6 shadow-clinicalSm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-lavender">
                  <MapPin className="h-5 w-5 text-clinical-teal-650" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Headquarters</div>
                  <div className="mt-1 text-sm text-clinical-charcoal/70">
                    Strathfield
                    <br />
                    New South Wales 2136
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl2 border border-black/5 bg-white p-6 shadow-clinicalSm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-lavender">
                  <Phone className="h-5 w-5 text-clinical-teal-650" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Direct Line</div>
                  <div className="mt-1 text-sm text-clinical-charcoal/70">0492831770</div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl2 border border-black/5 bg-white p-6 shadow-clinicalSm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-lavender">
                  <Mail className="h-5 w-5 text-clinical-teal-650" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Email Support</div>
                  <div className="mt-1 text-sm text-clinical-charcoal/70">
                    freshstartfacilitysolutions@gmail.com
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl2 border border-black/5 bg-clinical-lavender p-6 shadow-clinicalSm">
              <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
                LIVE SERVICE ZONES
              </div>
              <div className="mt-1 text-sm text-clinical-charcoal/60">Hover a zone to confirm teams are active.</div>
              <div className="mt-5">
                <ServiceMap />
              </div>
            </div>
          </div>

          <div className="rounded-xl2 border border-black/5 bg-white p-8 shadow-clinical">
            <h2 className="text-3xl">Secure Your Fresh Start</h2>
            <p className="mt-2 text-sm text-clinical-charcoal/65">
              Initialize your clinical-grade cleaning session in under 60 seconds.
            </p>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                    PRIMARY CONTACT NAME
                  </label>
                  <input
                    className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-clinical-navy outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-clinical-aqua/60"
                    placeholder="e.g. Julienne Smith"
                    value={primaryContactName}
                    onChange={(e) => setPrimaryContactName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-clinical-navy outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-clinical-aqua/60"
                    placeholder="e.g. julienne@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                    SERVICE SUBURB
                  </label>
                  <select
                    className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-clinical-navy outline-none focus:ring-2 focus:ring-clinical-aqua/60"
                    value={serviceSuburb}
                    onChange={(e) => setServiceSuburb(e.target.value)}
                    required
                  >
                    <option value="">Select Location</option>
                    <option>Surry Hills</option>
                    <option>Bondi</option>
                    <option>CBD</option>
                    <option>North Sydney</option>
                  </select>
                </div>
                <div className="hidden md:block" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                    SERVICE CATEGORY
                  </label>
                  <select
                    className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-clinical-navy outline-none focus:ring-2 focus:ring-clinical-aqua/60"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option>General Residential</option>
                    <option>Deep Cleaning</option>
                    <option>End of Lease</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                    PREFERRED ARRIVAL DATE
                  </label>
                  <input
                    type="date"
                    className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-clinical-navy outline-none focus:ring-2 focus:ring-clinical-aqua/60"
                    value={preferredArrivalDate}
                    onChange={(e) => setPreferredArrivalDate(e.target.value)}
                    min={minDate}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                  PURITY REQUIREMENTS &amp; NOTES
                </label>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-clinical-navy outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-clinical-aqua/60"
                  placeholder="Identify specific areas of concern or priority..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-clinical-charcoal/60">
                  <span className="font-semibold tracking-wide">DATA ACCURACY CHECK</span>
                  <span>{completeness}% Complete</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-black/5">
                  <div
                    className="h-2 rounded-full bg-clinical-teal-650 transition-[width]"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              <button
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-clinical-aqua px-6 text-base font-medium text-clinical-navy shadow-clinicalSm transition hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={
                  submitting ||
                  !primaryContactName.trim() ||
                  !email.trim() ||
                  !serviceSuburb ||
                  !serviceCategory ||
                  !preferredArrivalDate ||
                  !notes.trim()
                }
              >
                {submitting ? "Submitting…" : "Confirm Booking Request →"}
              </button>

              {submitResult?.ok ? null : submitResult ? (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitResult.message}
                </div>
              ) : null}

              <div className="text-center text-xs text-clinical-charcoal/55">
                Secure 256-bit Encrypted Reservation System
              </div>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
}

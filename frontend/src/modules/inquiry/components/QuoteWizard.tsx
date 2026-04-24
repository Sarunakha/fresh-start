"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Container } from "../../../components/layout/Container";
import { ServiceMap } from "../../../components/ServiceMap";

type QuoteWizardPayload = {
  spaceType: string;
  approximateSize: string;
  frequency: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  addOnKeys?: string[];
};

const SPACE_OPTIONS = ["Commercial Office", "Retail", "Industrial", "Residential"] as const;
const SIZE_OPTIONS = [
  "Under 1,000 sq ft",
  "1,000 - 5,000 sq ft",
  "5,000 - 10,000 sq ft",
  "10,000+ sq ft"
] as const;
const FREQ_OPTIONS = ["Daily", "Weekly", "Bi-Weekly", "One-time Deep Clean"] as const;

const cardBase =
  "rounded-xl2 border border-black/5 bg-white px-5 py-5 text-left text-sm font-semibold text-clinical-navy shadow-clinicalSm transition hover:border-clinical-aqua/70 hover:shadow-[0_12px_40px_rgba(165,230,223,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clinical-aqua";

function inferFromSelection(selection: string) {
  const s = selection.toLowerCase();
  const spaceType =
    s.includes("industrial") ? "Industrial" :
    s.includes("retail") ? "Retail" :
    s.includes("residential") || s.includes("bedroom") ? "Residential" :
    s.includes("office") || s.includes("commercial") ? "Commercial Office" :
    "Commercial Office";

  // We don't always know size; store selection string as an approximate descriptor.
  const approximateSize = selection.replace(/-/g, " ");
  return { spaceType, approximateSize };
}

export function QuoteWizard() {
  const [sp] = useSearchParams();
  const selection = sp.get("selection")?.trim() ?? "";

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [data, setData] = useState<Partial<QuoteWizardPayload>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [addOns, setAddOns] = useState<Array<{ id: string; key: string; name: string; priceRange: string }>>(
    []
  );
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selection) return;
    const inferred = inferFromSelection(selection);
    setData((d) => ({ ...d, ...inferred }));
    setStep(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pricing");
        if (!res.ok) return;
        const json = (await res.json()) as {
          addOns?: Array<{ id: string; key: string; name: string; priceRange: string; active?: boolean }>;
        };
        const next = (json.addOns ?? []).filter((a) => a && (a as any).active !== false);
        if (!cancelled) setAddOns(next);
      } catch {
        // ignore: add-ons are optional
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const progress = useMemo(() => {
    const total = 5;
    const current = Math.min(step, 5);
    return Math.round(((current - 1) / total) * 100);
  }, [step]);

  async function submitContact(form: HTMLFormElement) {
    const fd = new FormData(form);
    const contactName = String(fd.get("contactName") ?? "").trim();
    const contactEmail = String(fd.get("contactEmail") ?? "").trim();
    const contactPhone = String(fd.get("contactPhone") ?? "").trim();

    const payload: QuoteWizardPayload = {
      spaceType: String(data.spaceType ?? "").trim(),
      approximateSize: String(data.approximateSize ?? "").trim(),
      frequency: String(data.frequency ?? "").trim(),
      contactName,
      contactEmail,
      contactPhone: contactPhone || undefined,
      addOnKeys: addOns.filter((a) => selectedAddOns[a.key]).map((a) => a.key)
    };

    if (!payload.spaceType || !payload.approximateSize || !payload.frequency || !payload.contactName || !payload.contactEmail) {
      return { ok: false as const, error: "Please complete all required fields." };
    }

    const res = await fetch("/api/quote-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => null);

    if (!res || !res.ok) return { ok: false as const, error: "Unable to submit. Please try again." };
    return { ok: true as const };
  }

  if (step === 6) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl2 border border-black/5 bg-white p-10 text-center shadow-clinicalSm"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-clinical-aqua/30 text-clinical-navy text-lg font-semibold">
          ✓
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-clinical-navy">Thank you.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-clinical-charcoal/70">
          Thank you. A facility assessment specialist will review your details and contact you shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl2 border border-black/5 bg-white p-8 shadow-clinical"
    >
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-[0.2em] text-clinical-charcoal/55">
          <span>REQUEST QUOTE</span>
          <span>STEP {Math.min(step, 5)} / 5</span>
        </div>
        <div className="h-2 w-full rounded-full bg-black/5">
          <div className="h-2 rounded-full bg-clinical-aqua transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.section
            key="s1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-2xl font-semibold text-clinical-navy">What type of space?</h1>
            <p className="mt-2 text-sm text-clinical-charcoal/65">Select one option to continue.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SPACE_OPTIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={cardBase}
                  onClick={() => {
                    setData((d) => ({ ...d, spaceType: label }));
                    setStep(2);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.section>
        ) : null}

        {step === 2 ? (
          <motion.section
            key="s2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-4 text-xs font-semibold tracking-wide text-clinical-charcoal/60 hover:text-clinical-charcoal"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-clinical-navy">Approximate size?</h1>
            <p className="mt-2 text-sm text-clinical-charcoal/65">Best estimate is fine.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {SIZE_OPTIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={cardBase}
                  onClick={() => {
                    setData((d) => ({ ...d, approximateSize: label }));
                    setStep(3);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.section>
        ) : null}

        {step === 3 ? (
          <motion.section
            key="s3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep(selection ? 3 : 2)}
              className="mb-4 text-xs font-semibold tracking-wide text-clinical-charcoal/60 hover:text-clinical-charcoal"
              style={{ visibility: selection ? "hidden" : "visible" }}
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-clinical-navy">Required frequency?</h1>
            <p className="mt-2 text-sm text-clinical-charcoal/65">How often do you need service?</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {FREQ_OPTIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={cardBase}
                  onClick={() => {
                    setData((d) => ({ ...d, frequency: label }));
                    setStep(4);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.section>
        ) : null}

        {step === 4 ? (
          <motion.section
            key="s4"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep(3)}
              className="mb-4 text-xs font-semibold tracking-wide text-clinical-charcoal/60 hover:text-clinical-charcoal"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-clinical-navy">Optional add-ons</h1>
            <p className="mt-2 text-sm text-clinical-charcoal/65">
              Select any additional services you want included in your quote.
            </p>

            <div className="mt-6 rounded-xl border border-black/5 bg-clinical-lavender px-4 py-4 text-xs text-clinical-charcoal/70">
              <div className="font-semibold text-clinical-charcoal/80">Summary</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <span className="text-clinical-charcoal/50">Space:</span> {data.spaceType}
                </li>
                <li>
                  <span className="text-clinical-charcoal/50">Size:</span> {data.approximateSize}
                </li>
                <li>
                  <span className="text-clinical-charcoal/50">Frequency:</span> {data.frequency}
                </li>
              </ul>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {addOns.length === 0 ? (
                <div className="text-sm text-clinical-charcoal/60">
                  No add-ons available right now.
                </div>
              ) : (
                addOns.map((a) => (
                  <label
                    key={a.id}
                    className="flex cursor-pointer items-start gap-4 rounded-xl2 border border-black/5 bg-white px-5 py-4 text-left shadow-clinicalSm hover:border-clinical-aqua/60"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={Boolean(selectedAddOns[a.key])}
                      onChange={(e) =>
                        setSelectedAddOns((prev) => ({
                          ...prev,
                          [a.key]: e.target.checked
                        }))
                      }
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-clinical-navy">{a.name}</div>
                      <div className="mt-1 text-xs text-clinical-charcoal/65">{a.priceRange} AUD</div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" className="sm:w-auto" onClick={() => setStep(5)}>
                Continue
              </Button>
            </div>
          </motion.section>
        ) : null}

        {step === 5 ? (
          <motion.section
            key="s5"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep(4)}
              className="mb-4 text-xs font-semibold tracking-wide text-clinical-charcoal/60 hover:text-clinical-charcoal"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-clinical-navy">Contact details</h1>
            <p className="mt-2 text-sm text-clinical-charcoal/65">
              We&apos;ll use this to send your custom quote and follow up.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                const form = e.currentTarget;
                startTransition(() => {
                  void (async () => {
                    const res = await submitContact(form);
                    if (res.ok) setStep(6);
                    else setError(res.error);
                  })();
                });
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                    FULL NAME <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="contactName"
                    required
                    className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-clinical-aqua/60"
                    placeholder="e.g. Julienne Smith"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                    EMAIL ADDRESS <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="contactEmail"
                    type="email"
                    required
                    className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-clinical-aqua/60"
                    placeholder="e.g. name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold tracking-wide text-clinical-charcoal/70">
                  PHONE NUMBER <span className="text-clinical-charcoal/50">(optional)</span>
                </label>
                <input
                  name="contactPhone"
                  className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-clinical-aqua/60"
                  placeholder="04xx xxx xxx"
                />
              </div>

              {error ? (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}

              <Button className="w-full" size="lg" type="submit" disabled={pending}>
                {pending ? "Submitting…" : "Request Custom Quote"}
              </Button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function QuoteWizardPage() {
  return (
    <div>
      <section className="bg-clinical-white py-16">
        <Container>
          <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
            GET A QUOTE
          </div>
          <h1 className="mt-4 text-5xl">Custom facility quote</h1>
          <p className="mt-3 max-w-2xl text-sm text-clinical-charcoal/70">
            Answer a few quick questions so we can prepare an accurate proposal for your space.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-3xl">
          <QuoteWizard />
        </Container>
      </section>

      <section className="pb-16">
        <Container className="max-w-5xl">
          <div className="rounded-xl2 border border-black/5 bg-clinical-lavender p-8 shadow-clinicalSm">
            <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
              LIVE SERVICE ZONES
            </div>
            <h2 className="mt-3 text-3xl">Sydney Coverage Map</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-clinical-charcoal/70">
              Hover over a zone to confirm clinical teams are active across Sydney.
            </p>
            <div className="mt-8">
              <ServiceMap />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


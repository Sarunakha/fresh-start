"use client";

import { useCallback, useState, useTransition } from "react";
import { submitQuoteRequest, type QuoteWizardPayload } from "@/actions/quote-request-actions";

const NAVY = "#0A1922";
const AQUA = "#A5E6DF";

const SPACE_OPTIONS = ["Commercial Office", "Retail", "Industrial", "Residential"] as const;
const SIZE_OPTIONS = [
  "Under 1,000 sq ft",
  "1,000 - 5,000 sq ft",
  "5,000 - 10,000 sq ft",
  "10,000+ sq ft"
] as const;
const FREQ_OPTIONS = ["Daily", "Weekly", "Bi-Weekly", "One-time Deep Clean"] as const;

const TOTAL_STEPS = 4;

export function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<QuoteWizardPayload>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const progress = step <= TOTAL_STEPS ? ((step - 1) / TOTAL_STEPS) * 100 : 100;

  const pickSpace = useCallback((spaceType: string) => {
    setData((d) => ({ ...d, spaceType }));
    setStep(2);
  }, []);

  const pickSize = useCallback((approximateSize: string) => {
    setData((d) => ({ ...d, approximateSize }));
    setStep(3);
  }, []);

  const pickFreq = useCallback((frequency: string) => {
    setData((d) => ({ ...d, frequency }));
    setStep(4);
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const contactName = String(new FormData(form).get("contactName") ?? "").trim();
    const contactEmail = String(new FormData(form).get("contactEmail") ?? "").trim();
    const contactPhone = String(new FormData(form).get("contactPhone") ?? "").trim();

    const payload: QuoteWizardPayload = {
      spaceType: data.spaceType ?? "",
      approximateSize: data.approximateSize ?? "",
      frequency: data.frequency ?? "",
      contactName,
      contactEmail,
      contactPhone: contactPhone || undefined
    };

    startTransition(async () => {
      const res = await submitQuoteRequest(payload);
      if (res.ok) {
        setStep(5);
        form.reset();
      } else {
        setError(res.error);
      }
    });
  }

  if (step === 5) {
    return (
      <div
        className="mx-auto max-w-lg rounded-2xl border border-black/[0.06] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(10,25,34,0.08)]"
        style={{ color: NAVY }}
      >
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold"
          style={{ backgroundColor: `${AQUA}33`, color: NAVY }}
        >
          ✓
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Thank you.</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#0A1922]/75">
          A facility assessment specialist will review your details and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-2xl rounded-2xl border border-black/[0.06] bg-white px-6 py-8 shadow-[0_24px_80px_rgba(10,25,34,0.08)] sm:px-10 sm:py-10"
      style={{ color: NAVY }}
    >
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-[0.2em] text-[#0A1922]/45">
          <span>REQUEST QUOTE</span>
          <span>
            STEP {Math.min(step, TOTAL_STEPS)} / {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#0A1922]/10">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: AQUA }}
          />
        </div>
      </div>

      {step === 1 ? (
        <section>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">What type of space?</h1>
          <p className="mt-2 text-sm text-[#0A1922]/65">Select one option to continue.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {SPACE_OPTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => pickSpace(label)}
                className="rounded-2xl border border-[#0A1922]/10 bg-white px-5 py-5 text-left text-sm font-semibold text-[#0A1922] shadow-sm transition hover:border-[#A5E6DF] hover:shadow-[0_12px_40px_rgba(165,230,223,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5E6DF]"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-4 text-xs font-semibold tracking-wide text-[#0A1922]/50 hover:text-[#0A1922]"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Approximate size?</h1>
          <p className="mt-2 text-sm text-[#0A1922]/65">Best estimate is fine.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {SIZE_OPTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => pickSize(label)}
                className="rounded-2xl border border-[#0A1922]/10 bg-white px-5 py-5 text-left text-sm font-semibold text-[#0A1922] shadow-sm transition hover:border-[#A5E6DF] hover:shadow-[0_12px_40px_rgba(165,230,223,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5E6DF]"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mb-4 text-xs font-semibold tracking-wide text-[#0A1922]/50 hover:text-[#0A1922]"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Required frequency?</h1>
          <p className="mt-2 text-sm text-[#0A1922]/65">How often do you need service?</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FREQ_OPTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => pickFreq(label)}
                className="rounded-2xl border border-[#0A1922]/10 bg-white px-5 py-5 text-left text-sm font-semibold text-[#0A1922] shadow-sm transition hover:border-[#A5E6DF] hover:shadow-[0_12px_40px_rgba(165,230,223,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5E6DF]"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="mb-4 text-xs font-semibold tracking-wide text-[#0A1922]/50 hover:text-[#0A1922]"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contact details</h1>
          <p className="mt-2 text-sm text-[#0A1922]/65">
            We&apos;ll use this to send your custom quote and follow up.
          </p>

          <div className="mt-6 rounded-xl border border-[#0A1922]/8 bg-[#F9FAFB] px-4 py-4 text-xs text-[#0A1922]/70">
            <div className="font-semibold text-[#0A1922]/85">Summary</div>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="text-[#0A1922]/50">Space:</span> {data.spaceType}
              </li>
              <li>
                <span className="text-[#0A1922]/50">Size:</span> {data.approximateSize}
              </li>
              <li>
                <span className="text-[#0A1922]/50">Frequency:</span> {data.frequency}
              </li>
            </ul>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="qw-name" className="text-xs font-semibold tracking-wide text-[#0A1922]/70">
                Full name <span className="text-red-600">*</span>
              </label>
              <input
                id="qw-name"
                name="contactName"
                required
                autoComplete="name"
                className="mt-2 w-full rounded-xl border border-[#0A1922]/12 bg-white px-4 py-3 text-sm text-[#0A1922] outline-none ring-0 transition focus:border-[#A5E6DF] focus:shadow-[0_0_0_3px_rgba(165,230,223,0.35)]"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label htmlFor="qw-email" className="text-xs font-semibold tracking-wide text-[#0A1922]/70">
                Email address <span className="text-red-600">*</span>
              </label>
              <input
                id="qw-email"
                name="contactEmail"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-[#0A1922]/12 bg-white px-4 py-3 text-sm text-[#0A1922] outline-none transition focus:border-[#A5E6DF] focus:shadow-[0_0_0_3px_rgba(165,230,223,0.35)]"
                placeholder="you@company.com.au"
              />
            </div>
            <div>
              <label htmlFor="qw-phone" className="text-xs font-semibold tracking-wide text-[#0A1922]/70">
                Phone number <span className="text-[#0A1922]/40">(optional)</span>
              </label>
              <input
                id="qw-phone"
                name="contactPhone"
                type="tel"
                autoComplete="tel"
                className="mt-2 w-full rounded-xl border border-[#0A1922]/12 bg-white px-4 py-3 text-sm text-[#0A1922] outline-none transition focus:border-[#A5E6DF] focus:shadow-[0_0_0_3px_rgba(165,230,223,0.35)]"
                placeholder="04xx xxx xxx"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-xl py-3.5 text-sm font-semibold text-[#0A1922] shadow-[0_16px_40px_rgba(165,230,223,0.45)] transition hover:brightness-[1.02] disabled:opacity-60"
              style={{ backgroundColor: AQUA }}
            >
              {pending ? "Submitting…" : "Request Custom Quote"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}

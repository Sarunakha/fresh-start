"use client";

import { useMemo, useState } from "react";

type Service = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  priceRange: string;
  showPrice: boolean;
  features: string[];
  isPopular: boolean;
};

export function ServicesPricingClient({
  packages,
  addons
}: {
  packages: Service[];
  addons: Service[];
}) {
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>(
    {}
  );

  const totalAddOnsLabel = useMemo(() => {
    const selected = addons.filter((a) => selectedAddOns[a.id]);
    if (selected.length === 0) return "$0.00";
    return `${selected.length} selected`;
  }, [addons, selectedAddOns]);

  return (
    <div className="min-h-screen bg-[#F5F2F8] text-slate-900 antialiased">
      <section className="bg-[#07363B] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-[10px] font-semibold tracking-[0.32em] text-white/70">
            PREMIUM EDITORIAL CLEANING
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] md:text-5xl">
            Transparent Pricing for a
            <br className="hidden md:block" /> Pristine Sanctuary
          </h1>
          <p className="mt-5 max-w-3xl text-sm text-white/75">
            Elevate your living standards with clinical-grade precision. Our fixed-
            rate packages bring the laboratory of purity directly to your doorstep.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 pt-10">
        {packages.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-900">
              No packages available.
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Please check back soon.
            </div>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-3">
            {packages.map((s) => {
              const popular = Boolean(s.isPopular);
              return (
                <article
                  key={s.id}
                  className={[
                    "relative rounded-2xl bg-white px-8 pb-8 pt-10 shadow-[0_16px_40px_rgba(2,6,23,0.10)]",
                    popular
                      ? "border border-[#0A4B52] shadow-[0_22px_60px_rgba(2,6,23,0.16)] md:-mt-4"
                      : "border border-black/5"
                  ].join(" ")}
                >
                  <div className="absolute left-8 top-5 right-8 h-px bg-slate-200/80" />

                  {popular ? (
                    <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-[#0A4B52] px-4 py-1 text-[10px] font-semibold tracking-[0.28em] text-white">
                      MOST POPULAR
                    </div>
                  ) : null}

                  <div className="text-sm font-semibold text-slate-900">
                    {s.name}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-slate-500">
                    {s.category.toUpperCase()}
                  </div>

                  <div className="mt-6 flex items-end gap-2">
                    <div className="text-4xl font-semibold leading-none text-slate-900">
                      {s.showPrice ? s.priceRange : "Contact"}
                    </div>
                    <div className="pb-1 text-[10px] font-semibold tracking-[0.22em] text-slate-500">
                      AUD
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {(s.features ?? []).map((f, idx) => (
                      <li key={`${s.id}_f_${idx}`} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0A4B52]" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={[
                      "mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                      popular
                        ? "bg-[#0A4B52] text-white hover:bg-[#083E44]"
                        : "bg-[#A5E6DF] text-[#0F172A] hover:bg-[#8fe0d8]"
                    ].join(" ")}
                  >
                    {popular ? "Book Now" : "Select Package"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-[#F5F2F8]">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-4">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">
                The Precision Add-ons
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Customize your clinical care with our specialized restoration
                services. Select any service to add to your sanctuary package.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {addons.map((a) => (
                  <label
                    key={a.id}
                    className="relative flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(2,6,23,0.08)] ring-1 ring-black/5"
                  >
                    <input
                      type="checkbox"
                      className="absolute right-4 top-4 h-4 w-4"
                      checked={Boolean(selectedAddOns[a.id])}
                      onChange={(e) =>
                        setSelectedAddOns((prev) => ({
                          ...prev,
                          [a.id]: e.target.checked
                        }))
                      }
                    />
                    <div className="pt-1">
                      <div className="text-sm font-semibold text-slate-900">
                        {a.name}
                      </div>
                      {a.description ? (
                        <div className="mt-2 text-xs text-slate-500">
                          {a.description}
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-slate-500">
                          Clinical add-on service.
                        </div>
                      )}
                      <div className="mt-4 text-sm font-semibold text-slate-900">
                        {a.showPrice ? a.priceRange : "Custom Quote"}{" "}
                        <span className="text-xs font-semibold text-slate-500">
                          AUD
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-2xl bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.08)] ring-1 ring-black/5">
              <div className="text-[10px] font-semibold tracking-[0.32em] text-slate-500">
                TOTAL ADD-ONS
              </div>
              <div className="mt-6 text-4xl font-semibold text-slate-900">
                {totalAddOnsLabel}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Range-based add-ons are tracked by selection count.
              </div>
              <button className="mt-8 w-full rounded-xl bg-[#A5E6DF] px-4 py-3 text-sm font-semibold text-[#0F172A] hover:bg-[#8fe0d8]">
                Continue
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}


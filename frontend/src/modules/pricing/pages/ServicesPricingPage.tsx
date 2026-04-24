import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../../components/layout/Container";
import { Button } from "../../../components/ui/Button";

type PublicService = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  priceRange: string;
  showPrice: boolean;
  features: string[];
  sortOrder: number;
};

type AddOn = {
  id: string;
  key: string;
  name: string;
  priceRange: string;
};

export function ServicesPricingPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<PublicService[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [svcRes, pricingRes] = await Promise.all([
          fetch("/api/public/services"),
          fetch("/api/pricing")
        ]);

        if (svcRes.ok) {
          const svcJson = (await svcRes.json()) as { services: PublicService[] };
          if (!cancelled) setServices(svcJson.services ?? []);
        } else if (!cancelled) {
          setServices([]);
        }

        if (pricingRes.ok) {
          const data = (await pricingRes.json()) as {
            addOns: AddOn[];
          };
          if (!cancelled) {
            setAddOns(data.addOns ?? []);
          }
        } else if (!cancelled) {
          setAddOns([]);
        }
      } catch {
        if (!cancelled) {
          setServices([]);
          setAddOns([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, PublicService[]>();
    for (const s of services) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return Array.from(map.entries());
  }, [services]);

  const totalAddOnsLabel = useMemo(() => {
    const selected = addOns.filter((a) => selectedAddOns[a.id]);
    if (selected.length === 0) return "$0.00";
    return `${selected.length} selected`;
  }, [addOns, selectedAddOns]);

  const summaryLine = useMemo(() => {
    const find = (slug: string) => services.find((s) => s.slug === slug);
    const fmt = (s?: PublicService) =>
      s?.showPrice ? s.priceRange : "Contact for Assessment";
    return {
      grHourly: fmt(find("gr-hourly")),
      dc: fmt(find("dc-1-2-bed")) + " – " + fmt(find("dc-3plus-bed")),
      eol: fmt(find("eol-1-bed")) + " – " + fmt(find("eol-3-bed")),
      com: fmt(find("com-small-office")) + " – " + fmt(find("com-medium-office")),
      comHr: fmt(find("com-hourly"))
    };
  }, [services]);

  return (
    <div>
      <section className="bg-gradient-to-b from-clinical-navy to-[#061117] py-20 text-white">
        <Container>
          <h1 className="text-5xl leading-[0.95]">
            Professional Cleaning Services Across Sydney
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/75">
            Fresh Start Facility Solutions offers reliable cleaning services for homes,
            offices, and commercial spaces across Sydney. Each service is carried out
            with care, consistency, and attention to detail.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/55">
            Our Services
          </div>
          {loading ? (
            <div className="text-sm text-clinical-charcoal/60">Loading pricing…</div>
          ) : grouped.length === 0 ? (
            <div className="text-sm text-clinical-charcoal/60">
              Pricing is unavailable. Start the Admin Portal with{" "}
              <span className="font-mono">npm run dev</span> in{" "}
              <span className="font-mono">admin-portal</span> (port 3000) so this
              dev server can proxy{" "}
              <span className="font-mono">/api/public/services</span>.
            </div>
          ) : (
            <div className="space-y-16">
              {grouped.map(([category, items]) => (
                <div key={category}>
                  <div className="mb-6 text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/55">
                    {category.toUpperCase()}
                  </div>
                  <div className="grid gap-6 lg:grid-cols-3">
                    {items.map((s, idx) => (
                      <div
                        key={s.id}
                        className={`rounded-xl2 border border-black/5 bg-white p-8 shadow-clinicalSm ${
                          category === "General Residential" && idx === 1
                            ? "ring-1 ring-clinical-aqua/70"
                            : ""
                        }`}
                      >
                        <div className="text-sm font-semibold">{s.name}</div>
                        {s.description ? (
                          <div className="mt-1 text-xs tracking-wide text-clinical-charcoal/60">
                            {s.description}
                          </div>
                        ) : null}

                        {s.showPrice ? (
                          <>
                            <div className="mt-6 text-4xl font-semibold">
                              {s.priceRange}
                            </div>
                            <div className="mt-1 text-xs text-clinical-charcoal/60">
                              AUD
                            </div>
                          </>
                        ) : (
                          <div className="mt-6 rounded-xl border border-black/10 bg-clinical-lavender px-4 py-3 text-sm font-semibold text-clinical-charcoal/80">
                            Contact for Assessment
                          </div>
                        )}

                        <ul className="mt-6 space-y-3 text-sm text-clinical-charcoal/75">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-center gap-3">
                              <span className="h-1.5 w-1.5 rounded-full bg-clinical-aqua" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                          <Link to={`/get-a-quote?selection=${encodeURIComponent(s.slug)}`} className="block">
                            <Button className="w-full" type="button">
                              Get a Quote
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-sm text-clinical-charcoal/70">
            {loading ? (
              <span>Loading summary…</span>
            ) : services.length === 0 ? null : (
              <>
                Hourly: <span className="font-medium">{summaryLine.grHourly}</span>{" "}
                • Deep Cleaning:{" "}
                <span className="font-medium">{summaryLine.dc}</span> • End of
                Lease: <span className="font-medium">{summaryLine.eol}</span> •
                Commercial: <span className="font-medium">{summaryLine.com}</span>{" "}
                / Hourly <span className="font-medium">{summaryLine.comHr}</span>
              </>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-clinical-lavender py-16">
        <Container className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl">Optional Add-ons</h2>
            <p className="mt-3 text-sm text-clinical-charcoal/70">
              Select additional services if you’d like extra detail in specific areas.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {(addOns.length
                ? addOns
                : [
                    {
                      id: "oven",
                      key: "oven_restoration",
                      name: "Oven Cleaning",
                      priceRange: "$40–$80"
                    },
                    {
                      id: "carpet",
                      key: "carpet_steam",
                      name: "Carpet Steam Cleaning",
                      priceRange: "$50–$150"
                    },
                    {
                      id: "window",
                      key: "window_cleaning",
                      name: "Window Cleaning",
                      priceRange: "Contact for Assessment"
                    },
                    {
                      id: "fridge",
                      key: "fridge_cleaning",
                      name: "Fridge Cleaning",
                      priceRange: "Contact for Assessment"
                    }
                  ]
              ).map((a) => (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-start gap-4 rounded-xl2 bg-white p-6 shadow-clinicalSm"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={Boolean(selectedAddOns[a.id])}
                    onChange={(e) =>
                      setSelectedAddOns((prev) => ({
                        ...prev,
                        [a.id]: e.target.checked
                      }))
                    }
                  />
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="mt-1 text-sm text-clinical-charcoal/70">
                      {a.priceRange} AUD
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl2 bg-white p-8 shadow-clinicalSm">
            <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
              SELECTED ADD-ONS
            </div>
            <div className="mt-6 text-4xl font-semibold">{totalAddOnsLabel}</div>
            <div className="mt-2 text-sm text-clinical-charcoal/60">
              Add-ons are tracked by selection count.
            </div>
            <div className="mt-8">
              <Link
                to={`/get-a-quote?selection=${encodeURIComponent("addons")}`}
                className="block"
              >
                <Button className="w-full" type="button">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="text-base font-semibold text-clinical-charcoal/80">
            Choose the service that fits your space and let us handle the rest.
          </div>
          <Link to="/get-a-quote" className="inline-flex">
            <Button type="button">Get a Quote</Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}

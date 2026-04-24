import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Container } from "../../../components/layout/Container";
import { useWebsiteAssets } from "../../../hooks/useWebsiteAssets";
import { WEBSITE_ASSET_KEYS } from "../../../constants/websiteAssets";

type PublicReview = {
  id: string;
  clientName: string;
  role: string | null;
  reviewText: string;
  rating: number;
};

const TRANSFORMATION_KEYS = [
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_1,
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_2,
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_3,
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_4
] as const;

const TRANSFORMATION_FALLBACK_BG = [
  "bg-white",
  "bg-clinical-navy",
  "bg-clinical-aqua",
  "bg-white"
] as const;

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function padToMultiple<T>(arr: T[], size: number) {
  if (arr.length === 0) return arr;
  const out = [...arr];
  while (out.length % size !== 0) out.push(arr[out.length % arr.length]);
  return out;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "F";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "S";
  return `${a}${b}`.toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="mt-2 flex items-center gap-1" aria-label={`${r} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < r;
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${filled ? "text-clinical-aqua fill-clinical-aqua" : "text-slate-300"}`}
          />
        );
      })}
    </div>
  );
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const assets = useWebsiteAssets();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/reviews");
        if (!res.ok) {
          if (!cancelled) setReviews([]);
          return;
        }
        const data = (await res.json()) as { reviews: PublicReview[] };
        if (!cancelled) setReviews(data.reviews ?? []);
      } catch {
        if (!cancelled) setReviews([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="bg-clinical-navy py-20 text-white">
        <Container>
          <h1 className="text-5xl leading-[0.95]">
            Trusted Cleaning for Sydney Homes and Businesses
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/75">
            Fresh Start Facility Solutions earns trusted reviews from Sydney homes and businesses
            through reliable service, clear communication, and professional results.
          </p>
        </Container>
      </section>

      <section className="bg-clinical-lavender py-14">
        <Container>
          <div className="text-sm font-bold tracking-[0.28em] text-clinical-charcoal/70 text-center">
            Our Reviews
          </div>
          <div className="mt-3 text-center text-base font-semibold text-clinical-charcoal/75">
            Chosen by homes, offices, and local businesses that value dependable cleaning and
            consistent presentation.
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {["Northside", "Surry", "Bondi", "SydneyHQ"].map((l) => (
              <div
                key={l}
                className="flex h-14 items-center justify-center rounded-xl2 bg-white/70 text-sm font-bold tracking-wide text-clinical-charcoal/60"
              >
                {l}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <header className="text-center">
            <h2 className="text-5xl font-semibold tracking-tight text-[#0A1922] md:text-6xl">
              Our Customers
            </h2>
            <p className="mt-3 text-sm font-semibold tracking-wide text-[#0A1922]/60">
              Sydney&apos;s Choice for Clinical Purity.
            </p>
          </header>

          {reviews.length === 0 ? (
            <div className="mt-12 rounded-2xl bg-white p-10 text-center text-sm text-clinical-charcoal/70 shadow-sm ring-1 ring-black/5">
              No testimonials are currently live.
            </div>
          ) : (
            (() => {
              const cards = chunk(padToMultiple(reviews, 3), 3);
              const cardCount = cards.length;
              const gridCols =
                cardCount === 1
                  ? "grid-cols-1 place-items-center"
                  : cardCount === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
              const wrapperMax =
                cardCount === 1 ? "max-w-xl" : cardCount === 2 ? "max-w-5xl" : "max-w-7xl";
              const cardWidth = cardCount === 1 ? "w-full" : "w-full";

              return (
                <div className={`mt-12 mx-auto ${wrapperMax}`}>
                  <div className={`grid gap-8 ${gridCols}`}>
                    {cards.map((group, cardIdx) => (
                      <div
                        key={cardIdx}
                        className={`${cardWidth} rounded-xl2 bg-white p-6 shadow-clinicalSm ring-1 ring-black/5`}
                      >
                        {group.map((r, idx) => (
                          <div key={`${r.id}-${idx}`} className={idx === 0 ? "" : "pt-5"}>
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 shrink-0 rounded-full bg-[#0A1922] text-[#D9E8EC] flex items-center justify-center text-xs font-semibold ring-1 ring-black/5">
                                {initials(r.clientName)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-[#0A1922]">
                                  {r.clientName}
                                </div>
                                <div className="text-xs font-semibold tracking-wide text-[#0A1922]/55">
                                  {r.role ?? "Service"}
                                </div>
                                <Stars rating={r.rating} />
                              </div>
                            </div>

                            <blockquote className="mt-4 font-serif text-sm italic leading-6 text-[#0A1922]/85">
                              “{r.reviewText}”
                            </blockquote>

                            {idx < group.length - 1 ? (
                              <div className="mt-5 h-px w-full bg-slate-200/70" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          )}
        </Container>
      </section>

      <section className="bg-clinical-lavender py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-4">
            {TRANSFORMATION_KEYS.map((key, i) => {
              const row = assets[key];
              const url = row?.cloudinaryUrl;
              return (
                <div
                  key={key}
                  className={`relative aspect-square overflow-hidden rounded-xl2 shadow-clinicalSm ${TRANSFORMATION_FALLBACK_BG[i]}`}
                >
                  {url ? (
                    <img
                      src={url}
                      alt={row?.altText ?? "Transformation showcase"}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div>
            <h2 className="text-4xl">Why Choose Fresh Start</h2>
            <ul className="mt-6 space-y-3 text-sm text-clinical-charcoal/70">
              {[
                "Reliable service",
                "Professional presentation",
                "Flexible for homes and businesses"
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-clinical-aqua" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-6 text-clinical-charcoal/70">
              A cleaner space starts with a team you can trust.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

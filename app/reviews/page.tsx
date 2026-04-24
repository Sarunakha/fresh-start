import { getPublicReviews } from "@/actions/client-review-actions";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

type PublicReview = {
  id: string;
  clientName: string;
  role: string | null;
  reviewText: string;
  rating: number;
};

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
            className={`h-4 w-4 ${filled ? "text-[#A5E6DF] fill-[#A5E6DF]" : "text-slate-300"}`}
          />
        );
      })}
    </div>
  );
}

export default async function ReviewsPage() {
  const reviews = (await getPublicReviews()) as unknown as PublicReview[];
  const padded = padToMultiple(reviews, 3);
  const cards = chunk(padded, 3);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <section className="bg-[#0A1922] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-xs font-semibold tracking-[0.28em] text-white/70">
            OUR STRATEGIC NETWORK
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] md:text-5xl">
            Trusted Excellence
            <br className="hidden md:block" /> for the Best.
          </h1>
          <p className="mt-5 max-w-3xl text-sm text-white/75">
            Collaborating with industry leaders to maintain environments that
            reflect clinical precision and architectural purity.
          </p>

          <div className="mt-10 grid grid-cols-4 gap-6 opacity-60">
            {["Northside", "Surry", "Bondi", "SydneyHQ"].map((label) => (
              <div
                key={label}
                className="flex h-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-xs font-semibold"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F2F8] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <header className="text-center">
            <h2 className="text-5xl font-semibold tracking-tight text-[#0A1922] md:text-6xl">
              Our Customers
            </h2>
            <p className="mt-3 text-sm font-semibold tracking-wide text-[#0A1922]/60">
              Sydney&apos;s Choice for Clinical Purity.
            </p>
          </header>

          {reviews.length === 0 ? (
            <div className="mt-12 rounded-2xl bg-white p-10 text-center text-sm text-slate-600 shadow-sm ring-1 ring-black/5">
              No testimonials are currently live.
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((group, cardIdx) => (
                <div
                  key={cardIdx}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5"
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
          )}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-black/5" />
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-black/5" />
            </div>
            <div className="max-w-xl">
              <div className="text-xs font-semibold tracking-[0.28em] text-slate-500">
                CASE STUDY: HORIZON CENTER
              </div>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-[#0A1922]">
                Transformation of
                <br /> Professional Environments.
              </h2>
              <p className="mt-5 text-sm text-slate-600">
                Our methodology treats cleaning as a technical discipline. We
                utilize ATP testing and antimicrobial surfacing to ensure spaces
                aren&apos;t just visually clean, but biologically pure.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-black/5">
                  <div className="text-3xl font-semibold text-[#0A1922]">48hrs</div>
                  <div className="mt-1 text-xs font-semibold tracking-wide text-slate-500">
                    Lead time
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-black/5">
                  <div className="text-3xl font-semibold text-[#0A1922]">12-Stage</div>
                  <div className="mt-1 text-xs font-semibold tracking-wide text-slate-500">
                    Process
                  </div>
                </div>
              </div>

              <button className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#0A4B52] hover:underline">
                Review Scientific Protocol →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Check, Microscope, Shield } from "lucide-react";
import { Container } from "../../../components/layout/Container";
import { useWebsiteAssets } from "../../../hooks/useWebsiteAssets";
import { WEBSITE_ASSET_KEYS } from "../../../constants/websiteAssets";
import { useEffect, useState } from "react";
import { ServiceMap } from "../../../components/ServiceMap";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1400&q=80";
const FALLBACK_METHODOLOGY =
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80";
const FALLBACK_HERO_SUBTEXT =
  "Fresh Start Facility Solutions Sydney provides reliable, high-quality cleaning services for homes, apartments, offices, and shared spaces across Sydney. We focus on the details that matter most, delivering clean, refreshed environments that feel comfortable, presentable, and professionally maintained. Whether you need a regular service, a one-off deep clean, or help preparing a property for handover, our goal is simple: leave every space noticeably better than we found it.";

export function HomePage() {
  const assets = useWebsiteAssets();
  const heroSrc =
    assets[WEBSITE_ASSET_KEYS.HOME_HERO_BG]?.cloudinaryUrl ?? FALLBACK_HERO;
  const heroAlt =
    assets[WEBSITE_ASSET_KEYS.HOME_HERO_BG]?.altText ?? "Architectural home";
  const methodologySrc =
    assets[WEBSITE_ASSET_KEYS.HOME_METHODOLOGY_FEATURE]?.cloudinaryUrl ??
    FALLBACK_METHODOLOGY;
  const methodologyAlt =
    assets[WEBSITE_ASSET_KEYS.HOME_METHODOLOGY_FEATURE]?.altText ??
    "Clinical cleaning methodology";

  const [banner, setBanner] = useState<{ headline: string; subtext: string } | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/public/site-content").catch(() => null);
      if (!res?.ok) return;
      const json = (await res.json()) as {
        heroBanner: { headline: string; subtext: string } | null;
      };
      if (!cancelled) setBanner(json.heroBanner);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroSubtext =
    banner?.subtext?.trim() &&
    // If marketing content still has the old placeholder copy, prefer the new homepage text.
    !banner.subtext.toLowerCase().includes("premium cleaning services across sydney")
      ? banner.subtext
      : FALLBACK_HERO_SUBTEXT;

  return (
    <div>
      {/* Single hero section (prevents double-rendered heroes). */}
      <section className="relative min-h-[70vh] overflow-hidden lg:grid lg:grid-cols-2">
        <div className="relative min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroSrc} alt={heroAlt} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>
          <div className="relative flex min-h-[70vh] items-end p-10">
            <h1 className="max-w-md text-5xl leading-[0.95] text-white">
              {banner?.headline ?? (
                <>
                  A Fresh Start
                  <span className="block text-clinical-aqua">for Every Space</span>
                </>
              )}
            </h1>
          </div>
        </div>

        {/* On mobile: overlay card on the image; on desktop: right panel as before. */}
        <div className="lg:flex lg:items-center lg:bg-clinical-white">
          <Container className="lg:py-16">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 lg:static lg:pointer-events-auto">
              <div className="mx-auto w-full max-w-6xl px-6 pb-8 lg:p-0">
                <div className="max-w-md rounded-xl2 bg-white/92 p-6 shadow-clinicalSm backdrop-blur lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
                  <div className="text-sm font-semibold tracking-[0.28em] text-clinical-charcoal/60">
                    Premium Cleaning Services Across Sydney
                  </div>
                  <p className="mt-6 max-w-md text-sm leading-6 text-clinical-charcoal/75">
                    {heroSubtext}
                  </p>
                  <div className="mt-10 text-sm text-clinical-charcoal/55">
                    Residential Cleaning • Commercial Cleaning • End of Lease • Deep Cleaning •
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section className="bg-clinical-lavender py-16">
        <Container>
          <h2 className="text-3xl">Foundation of Fresh Start</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-clinical-charcoal/70">
            Everything we do is built on standards that keep our service dependable, respectful,
            and consistent.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Honesty",
                icon: Shield,
                body:
                  "We believe clients deserve clarity from the beginning. That means straightforward communication, realistic service expectations, and pricing that reflects the actual work required. No confusion, no unnecessary upselling, and no vague promises."
              },
              {
                title: "Reliability",
                icon: Check,
                body:
                  "A cleaning service should make life easier, not harder. We value punctuality, consistency, and clear follow-through so our clients know they can rely on us to deliver as agreed, every time."
              },
              {
                title: "Detail",
                icon: Microscope,
                body:
                  "The difference between an average clean and a professional one is attention to detail. We focus on the finishing touches, overlooked corners, surfaces, fittings, and presentation standards that make a space feel truly refreshed."
              }
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-xl2 bg-white p-8 shadow-clinicalSm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-lavender">
                  <c.icon className="h-5 w-5 text-clinical-teal-650" />
                </div>
                <div className="mt-4 font-semibold">{c.title}</div>
                <div className="mt-2 text-sm leading-6 text-clinical-charcoal/70">
                  {c.body}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-sm font-semibold tracking-[0.28em] text-clinical-charcoal/60">
              Our Approach
            </div>
            <h2 className="mt-4 text-4xl">The Standard Behind Every Clean</h2>
            <p className="mt-5 text-sm leading-6 text-clinical-charcoal/75">
              At Fresh Start Facility Solutions, we approach each job with a structured process
              designed for quality, consistency, and care. We do not believe in rushed surface-only
              cleaning. Our method focuses on practical detail, proper sequencing, and thoughtful
              presentation so that every room looks cleaner, feels fresher, and functions better
              after service. This approach helps us maintain a dependable standard across both
              residential and commercial work.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-clinical-charcoal/75">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-clinical-aqua" />
                Structured room-by-room cleaning process
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-clinical-aqua" />
                Attention to high-touch and high-use surfaces
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-clinical-aqua" />
                Careful product selection for different materials and spaces
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-clinical-aqua" />
                Final visual check for presentation and consistency
              </li>
            </ul>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl2 bg-clinical-lavender p-6 shadow-clinicalSm">
                <div className="text-sm font-semibold">Consistent Results</div>
                <div className="mt-2 text-sm leading-6 text-clinical-charcoal/70">
                  A reliable process helps us maintain the same professional standard across every
                  service.
                </div>
              </div>
              <div className="rounded-xl2 bg-clinical-lavender p-6 shadow-clinicalSm">
                <div className="text-sm font-semibold">Careful Handling</div>
                <div className="mt-2 text-sm leading-6 text-clinical-charcoal/70">
                  We treat each property with respect, working carefully around furniture, fittings,
                  and everyday spaces.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl2 bg-white shadow-clinical" />
            <div className="rounded-xl2 bg-clinical-navy shadow-clinical" />
            <div className="rounded-xl2 bg-clinical-aqua shadow-clinical">
              <div className="p-6">
                <div className="text-xs font-semibold tracking-[0.26em] text-clinical-navy/70">
                  PRESENTATION
                </div>
                <div className="mt-6 text-3xl font-semibold text-clinical-navy">
                  Final
                </div>
                <div className="mt-2 text-sm text-clinical-navy/70">
                  visual check
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl2 bg-clinical-teal-650 shadow-clinical">
              <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                <img
                  src={methodologySrc}
                  alt={methodologyAlt}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-clinical-navy py-16 text-white">
        <Container className="flex flex-col items-center justify-center gap-6 text-center md:flex-row md:text-left">
          <h2 className="text-3xl">Ready to bring a fresh standard of clean into your space?</h2>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-xl2 border border-black/5 bg-clinical-lavender p-8 shadow-clinicalSm">
            <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
              LIVE SERVICE ZONES
            </div>
            <h2 className="mt-3 text-3xl">Sydney Coverage Map</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-clinical-charcoal/70">
              Explore our active coverage across Sydney. Hover over a zone to confirm clinical teams are live.
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


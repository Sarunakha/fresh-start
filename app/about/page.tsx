"use client";

import { Container } from "@/components/layout/Container";
import { useWebsiteAssets } from "@/hooks/useWebsiteAssets";
import { WEBSITE_ASSET_KEYS } from "@/constants/websiteAssets";

const FALLBACK_STORY_1 =
  "https://images.unsplash.com/photo-1525943837837-4f21f5038d90?auto=format&fit=crop&w=1200&q=80";
const FALLBACK_STORY_2 =
  "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=1200&q=80";

export default function AboutPage() {
  const assets = useWebsiteAssets();
  const story1Src = assets[WEBSITE_ASSET_KEYS.ABOUT_US_STORY_1]?.cloudinaryUrl ?? FALLBACK_STORY_1;
  const story1Alt =
    assets[WEBSITE_ASSET_KEYS.ABOUT_US_STORY_1]?.altText ?? "Fresh Start Facility Solutions Sydney";
  const story2Src = assets[WEBSITE_ASSET_KEYS.ABOUT_US_STORY_2]?.cloudinaryUrl ?? FALLBACK_STORY_2;
  const story2Alt =
    assets[WEBSITE_ASSET_KEYS.ABOUT_US_STORY_2]?.altText ?? "Fresh Start Facility Solutions Sydney";

  return (
    <div>
      <section className="bg-clinical-lavender py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 bg-clinical-navy shadow-clinical">
            <img src={story1Src} alt={story1Alt} className="h-full w-full object-cover opacity-75" />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
              About Fresh Start
            </div>
            <h1 className="mt-4 text-5xl">Cleaning Built on Care, Consistency, and Respect</h1>
            <p className="mt-5 text-sm leading-6 text-clinical-charcoal/70">
              Fresh Start Facility Solutions was built with a simple purpose: to provide dependable cleaning
              services that people across Sydney can trust. We understand that a clean space is not just
              about appearance. It affects comfort, routine, productivity, hygiene, and peace of mind. That
              is why we take every service seriously, whether we are cleaning a family home, refreshing a
              rental property, maintaining a workplace, or preparing a space for its next stage. Our team
              believes good cleaning should feel professional, straightforward, and worth the investment.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
              Who We Are
            </div>
            <h2 className="mt-4 text-4xl">A Sydney-based Team You Can Rely On</h2>
            <p className="mt-5 text-sm leading-6 text-clinical-charcoal/70">
              Fresh Start Facility Solutions is a Sydney-based cleaning business serving residential and
              commercial clients across the city. We specialise in practical, high-standard cleaning
              services designed for real homes, real businesses, and real day-to-day needs. Our work is
              shaped by reliability, strong presentation standards, and respect for the spaces we enter.
              We are not trying to be the loudest name in the market. We aim to be one of the most
              dependable — a company clients can call when they want the job done properly.
            </p>
            <div className="mt-10 rounded-xl2 bg-clinical-lavender p-8">
              <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
                What Makes Us Different
              </div>
              <p className="mt-4 text-sm leading-6 text-clinical-charcoal/70">
                What sets Fresh Start apart is our focus on balance: strong results, professional conduct,
                and a service experience that feels easy for the client. We know people are not just paying
                for surfaces to be wiped. They are paying for peace of mind, better presentation, saved
                time, and a space that feels cared for. That is why we place equal importance on both the
                outcome and the way we deliver it. We communicate clearly, show up prepared, and complete
                our work with attention to detail rather than rushing through a checklist.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 bg-clinical-navy shadow-clinical">
            <img src={story2Src} alt={story2Alt} className="h-full w-full object-cover opacity-85" />
          </div>
        </Container>
      </section>

      <section className="bg-clinical-navy py-16 text-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="text-xs font-semibold tracking-[0.28em] text-white/60">Our Mission</div>
            <p className="mt-4 text-sm leading-6 text-white/80">
              Our mission is to raise the everyday standard of cleaning by delivering reliable,
              detail-focused service that helps homes feel calmer, workplaces feel more presentable, and
              properties feel ready for what comes next. We want every client to feel that choosing Fresh
              Start was a smart, worthwhile decision.
            </p>
          </div>
          <div className="rounded-xl2 border border-white/10 bg-white/5 p-8">
            <div className="text-xs font-semibold tracking-[0.28em] text-white/60">Our Values</div>
            <ol className="mt-5 space-y-4 text-sm text-white/80">
              <li>
                <div className="font-semibold text-white">1. Respect for Every Space</div>
                <div className="mt-1 text-white/75">
                  We treat every property carefully, whether it is a private home, an office, or a shared
                  environment. We understand that we are working inside spaces that matter to people.
                </div>
              </li>
              <li>
                <div className="font-semibold text-white">2. Consistency in Service</div>
                <div className="mt-1 text-white/75">
                  A strong cleaning business should not depend on luck. We value systems, preparation, and
                  attention to detail, so our clients receive a dependable level of service each time.
                </div>
              </li>
              <li>
                <div className="font-semibold text-white">3. Honest Communication</div>
                <div className="mt-1 text-white/75">
                  We believe clients deserve clear information, realistic timelines, and straightforward
                  service. Trust grows when communication is simple and genuine.
                </div>
              </li>
              <li>
                <div className="font-semibold text-white">4. Pride in the Result</div>
                <div className="mt-1 text-white/75">
                  We take pride in work that is visibly better, not just technically completed. We want the
                  result to feel fresh, complete, and professionally handled.
                </div>
              </li>
            </ol>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Sydney-wide Coverage",
              body: "Servicing homes, apartments, offices, and shared spaces across Sydney"
            },
            {
              title: "Flexible Booking Options",
              body: "One-off, scheduled, and customised cleaning based on property needs"
            },
            {
              title: "Professional Service Standard",
              body: "Focused on quality presentation, practical detail, and reliable delivery"
            }
          ].map((c) => (
            <div key={c.title} className="rounded-xl2 bg-clinical-lavender p-8 shadow-clinicalSm">
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="mt-3 text-sm leading-6 text-clinical-charcoal/70">{c.body}</div>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-clinical-lavender py-16">
        <Container className="max-w-4xl">
          <h2 className="text-3xl">Why Clients Choose Fresh Start</h2>
          <p className="mt-4 text-sm leading-6 text-clinical-charcoal/70">
            Clients choose Fresh Start Facility Solutions because they want more than a basic clean. They
            want a team that arrives on time, works with care, communicates clearly, and leaves the space
            looking refreshed and better maintained. Our aim is to build long-term trust by doing the
            small things properly, staying consistent, and making the whole experience easier from booking
            to finish.
          </p>
          <div className="mt-8 text-lg font-semibold text-clinical-charcoal">
            Let your next clean be a genuine fresh start.
          </div>
        </Container>
      </section>
    </div>
  );
}


import { getHeroBanner } from "@/actions/site-content-actions";
import { MarketingControlsClient } from "./ui/MarketingControlsClient";

export const dynamic = "force-dynamic";

export default async function AdminMarketingPage() {
  const banner = await getHeroBanner();
  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
          MARKETING CONTROLS
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Dynamic Banner Manager</h1>
        <p className="mt-2 text-sm text-slate-200/70">
          Update the website hero headline and subtext without changing code.
        </p>
      </div>

      <MarketingControlsClient
        initial={{
          headline: banner?.headline ?? "A Fresh Start for Every Space",
          subtext:
            banner?.subtext ??
            "Premium cleaning services across Sydney — reliable, meticulous, and client-focused."
        }}
      />
    </div>
  );
}


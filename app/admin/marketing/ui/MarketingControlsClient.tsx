"use client";

import { useMemo, useState, useTransition } from "react";
import { updateHeroBanner } from "@/actions/site-content-actions";

export function MarketingControlsClient({
  initial
}: {
  initial: { headline: string; subtext: string };
}) {
  const [headline, setHeadline] = useState(initial.headline);
  const [subtext, setSubtext] = useState(initial.subtext);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const remaining = useMemo(() => {
    return {
      headline: 80 - headline.trim().length,
      subtext: 160 - subtext.trim().length
    };
  }, [headline, subtext]);

  function onSave() {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateHeroBanner(headline, subtext);
        setMessage("Saved. Home page updated.");
      } catch {
        setMessage("Could not save. Please try again.");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="text-sm font-semibold text-white">Hero banner</div>
        <div className="mt-6 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
                HEADLINE
              </label>
              <div className="text-xs text-slate-200/50 tabular-nums">
                {remaining.headline}
              </div>
            </div>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={80}
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0B1220]/70 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[#A5E6DF]/50"
              placeholder="e.g. Trusted Excellence"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
                SUBTEXT
              </label>
              <div className="text-xs text-slate-200/50 tabular-nums">
                {remaining.subtext}
              </div>
            </div>
            <textarea
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              maxLength={160}
              className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-[#0B1220]/70 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#A5E6DF]/50"
              placeholder="e.g. Sydney's Clinical Purity Specialist"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={pending || !headline.trim() || !subtext.trim()}
              className="rounded-xl bg-[#A5E6DF] px-5 py-3 text-sm font-semibold text-[#0A1922] hover:bg-[#7cf0dc] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save banner"}
            </button>
            {message ? <div className="text-sm text-slate-200/70">{message}</div> : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="text-sm font-semibold text-white">Live preview</div>
        <div className="mt-6 rounded-2xl bg-[#0A1922] p-6 ring-1 ring-white/10">
          <div className="text-3xl font-semibold leading-[1.05] text-white">
            {headline.trim() || "—"}
          </div>
          <div className="mt-4 text-sm leading-6 text-white/70">
            {subtext.trim() || "—"}
          </div>
          <div className="mt-6 h-1 w-24 rounded-full bg-[#A5E6DF]/70" />
        </div>
      </div>
    </div>
  );
}


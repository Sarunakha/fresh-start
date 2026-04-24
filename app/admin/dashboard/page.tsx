import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function mix(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").trim();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function lerpHex(from: string, to: string, t: number) {
  const tt = clamp01(t);
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const r = mix(a.r, b.r, tt);
  const g = mix(a.g, b.g, tt);
  const bl = mix(a.b, b.b, tt);
  return `rgb(${r} ${g} ${bl})`;
}

export default async function AdminDashboardPage() {
  const grouped = await prisma.quoteRequest
    .groupBy({
      by: ["spaceType"],
      _count: { _all: true }
    })
    .catch(() => []);
  const top = grouped
    .map((g) => ({ key: g.spaceType, count: g._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const max = top.reduce((m, x) => Math.max(m, x.count), 0) || 1;

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
          ADMIN DASHBOARD
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-200/70">
          Overview of operations. (Next: wire real stats + recent activity.)
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
          <div className="text-sm font-semibold text-white">Quick actions</div>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/admin/gallery"
              className="rounded-xl bg-[#99F6E4] px-4 py-3 text-sm font-semibold text-[#0F172A] text-center hover:bg-[#7cf0dc]"
            >
              Go to Gallery Manager
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
          <div className="text-sm font-semibold text-white">System</div>
          <div className="mt-3 text-sm text-slate-200/70">All services online.</div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
          <div className="text-sm font-semibold text-white">Security</div>
          <div className="mt-3 text-sm text-slate-200/70">Session protected (JWT cookie).</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
              TOP SERVICE HEATMAP
            </div>
            <div className="mt-2 text-lg font-semibold text-white">Most requested space types</div>
            <div className="mt-2 text-sm text-slate-200/70">
              Based on incoming quote requests.
            </div>
          </div>
          <div className="text-xs text-slate-200/55 whitespace-nowrap">
            Gradient: <span className="font-semibold text-[#A5E6DF]">Aqua</span>{" "}
            → <span className="font-semibold text-[#0A1922]">Navy</span>
          </div>
        </div>

        {top.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white/5 px-4 py-4 text-sm text-slate-200/65">
            No quote requests yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {top.map((x) => {
              const pct = x.count / max;
              const color = lerpHex("#A5E6DF", "#0A1922", pct * 0.9);
              return (
                <div key={x.key} className="grid grid-cols-[180px_1fr_44px] items-center gap-4">
                  <div className="text-sm font-semibold text-slate-200/90 truncate" title={x.key}>
                    {x.key}
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(4, pct * 100)}%`, background: color }} />
                  </div>
                  <div className="text-sm font-semibold text-white text-right tabular-nums">
                    {x.count}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


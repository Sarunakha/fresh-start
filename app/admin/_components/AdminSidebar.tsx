"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Images, Users, Wrench, CalendarDays, FileText, Layout, LogOut } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/gallery", label: "Image Content", icon: Images },
  { href: "/admin/clients", label: "Reviews", icon: Users },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/marketing", label: "Marketing Controls", icon: Layout }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="min-h-screen w-[260px] bg-[#111827] text-slate-200 flex flex-col border-r border-white/10">
      <div className="px-6 py-7">
        <Link
          href="/admin/dashboard"
          className="block rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#99F6E4]/70"
        >
          <Image
            src="/logo.svg"
            alt="Fresh Start Facility Solutions"
            width={240}
            height={72}
            className="h-auto w-full max-w-[200px] object-contain object-left"
            priority
            unoptimized
          />
        </Link>
      </div>

      <nav className="px-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                active
                  ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-slate-200/75 hover:bg-white/5 hover:text-[#99F6E4]"
              }`}
            >
              <Icon className="h-4 w-4 opacity-90" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6 py-6">
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="mb-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200/80 hover:text-[#99F6E4] hover:bg-white/10 border border-white/10 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out…" : "Logout"}
        </button>

        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-4 backdrop-blur-xl border border-white/10">
          <div className="h-10 w-10 rounded-2xl bg-[#99F6E4]/15 text-[#99F6E4] flex items-center justify-center text-xs font-semibold ring-1 ring-white/10">
            FS
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">Fresh Start</div>
            <div className="truncate text-xs text-slate-200/60">Admin Account</div>
          </div>
        </div>
      </div>
    </aside>
  );
}


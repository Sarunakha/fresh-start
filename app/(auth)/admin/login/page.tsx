"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AtSign, Eye, EyeOff, Lock, Shield, ShieldCheck, UserRound } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]" />}>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = useMemo(() => sp.get("next") ?? "/admin/gallery", [sp]);
  const toast = useMemo(() => sp.get("toast"), [sp]);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toast === "password-updated") {
      setToastMessage("Password updated successfully.");
      const t = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: usernameOrEmail, password, remember })
    }).catch(() => null);

    if (!res || !res.ok) {
      setLoading(false);
      setError("Invalid credentials.");
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] antialiased p-6 lg:p-12">
      <div className="w-full max-w-6xl rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[640px]">
          <section className="hidden md:flex flex-col justify-between p-16 bg-[#2D5A5A] text-slate-200">
            <div className="text-sm font-semibold tracking-wide text-white/90">
              Fresh Start Facility Solutions
            </div>
            <div>
              <div className="mt-6 text-5xl font-semibold leading-[1.05] text-white">
                Manage the
                <br />
                Healthy Sanctuary.
              </div>
              <div className="mt-8 max-w-md text-sm text-slate-200/80">
                Access your administrative dashboard to oversee metropolitan Sydney&apos;s most
                meticulous cleaning service operations.
              </div>
            </div>
            <div className="text-xs text-white/70">SECURE ADMIN ACCESS</div>
          </section>

          <section className="p-10 md:p-16 flex flex-col justify-center text-slate-200">
            <div className="max-w-md">
              <h1 className="text-3xl font-semibold text-white">Welcome Back</h1>
              <p className="mt-2 text-sm text-slate-200/70">
                Please enter your credentials to access the administrative panel.
              </p>

              {toastMessage ? (
                <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {toastMessage}
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="mt-10 space-y-6">
                <div>
                  <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
                    USERNAME OR EMAIL
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/20 focus-within:border-white/30">
                    <AtSign className="h-4 w-4 text-[#99F6E4]" />
                    <input
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      className="w-full appearance-none bg-transparent text-sm text-white outline-none placeholder:text-slate-300/60 shadow-none border-0"
                      placeholder="admin@freshstartfacility.com"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
                      PASSWORD
                    </label>
                    <Link
                      href="/admin/forgot-password"
                      className="text-xs font-semibold text-slate-200/70 hover:text-[#99F6E4]"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/20 focus-within:border-white/30">
                    <Lock className="h-4 w-4 text-[#99F6E4]" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full appearance-none bg-transparent text-sm text-white outline-none placeholder:text-slate-300/60 shadow-none border-0"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-slate-200/70 hover:text-[#99F6E4]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-200/80">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/10"
                  />
                  Keep me logged in for 30 days
                </label>

                {error ? (
                  <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 border border-red-500/20">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center font-semibold rounded-xl bg-[#99F6E4] text-[#0F172A] hover:bg-[#7cf0dc] disabled:opacity-60 shadow-[0_18px_36px_rgba(153,246,228,0.18)]"
                >
                  {loading ? "Signing in…" : "Login to Dashboard →"}
                </button>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="text-xs text-slate-200/70 flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#99F6E4]/20 text-[#99F6E4] border border-white/10">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200">SECURE SESSION</div>
                      <div className="text-[11px] text-slate-200/60">AES-256 Bit Encryption</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200/40">
                    <Shield className="h-4 w-4" />
                    <UserRound className="h-4 w-4" />
                  </div>
                </div>
              </form>

              <div className="mt-10 text-center text-xs text-slate-200/50">
                © {new Date().getFullYear()} Fresh Start Facility Solutions Sydney. Professional Use Only.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


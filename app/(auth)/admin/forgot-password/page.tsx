"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth-actions";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await requestPasswordReset(email);
        setSent(true);
      } catch {
        setError("Unable to send reset link. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] antialiased p-6 lg:p-12">
      <div className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8 md:p-10 text-slate-200">
        <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
          PASSWORD RESET
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-200/70">
          Enter your admin email address and we’ll send a reset link.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-semibold text-white">Check your inbox</div>
            <div className="mt-1 text-sm text-slate-200/70">
              If an account exists with that email, a reset link has been sent.
            </div>
            <div className="mt-5">
              <Link className="text-sm font-semibold text-[#99F6E4] hover:underline" href="/admin/login">
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
                ADMIN EMAIL
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300/50 focus:border-white/30"
                placeholder="admin@freshstartfacility.com"
                autoComplete="email"
              />
            </div>

            {error ? (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 border border-red-500/20">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full h-12 flex items-center justify-center font-semibold rounded-xl bg-[#99F6E4] text-[#0F172A] hover:bg-[#7cf0dc] disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send reset link"}
            </button>

            <div className="text-center">
              <Link className="text-sm font-semibold text-slate-200/70 hover:text-[#99F6E4]" href="/admin/login">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


"use client";

import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { resetPassword } from "@/actions/auth-actions";

function isStrongPassword(pw: string) {
  // 8+ chars, at least one letter and one number
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]" />}>
      <AdminResetPasswordInner />
    </Suspense>
  );
}

function AdminResetPasswordInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => sp.get("token") ?? "", [sp]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      router.replace("/admin/login?toast=password-updated");
      router.refresh();
    }, 900);
    return () => clearTimeout(t);
  }, [done, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Reset link is missing a token.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters and include a letter and a number.");
      return;
    }

    startTransition(async () => {
      const res = await resetPassword(token, password);
      if (!res.ok) {
        setError(res.error ?? "Unable to reset password. Please try again.");
        return;
      }
      setDone(true);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] antialiased p-6 lg:p-12">
      <div className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8 md:p-10 text-slate-200">
        <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
          PASSWORD RESET
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-200/70">Choose a new password for your admin account.</p>

        {done ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-semibold text-white">Password updated</div>
            <div className="mt-1 text-sm text-slate-200/70">Redirecting to login…</div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
                NEW PASSWORD
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/20 focus-within:border-white/30">
                <Lock className="h-4 w-4 text-[#99F6E4]" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm text-white outline-none placeholder:text-slate-300/60 shadow-none border-0"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="text-slate-200/70 hover:text-[#99F6E4]"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-200/55">
                Must be 8+ characters and include a letter and a number.
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-200/70">
                CONFIRM NEW PASSWORD
              </label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-300/50 focus:border-white/30"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
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
              {pending ? "Updating…" : "Update password"}
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


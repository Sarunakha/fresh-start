"use client";

import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm?: () => void;
  onCancel: () => void;
};

export function ModalDialog({
  open,
  title,
  description,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel
}: Props) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-red-500/10 text-red-200 border border-red-500/20 hover:bg-red-500/15"
      : "bg-[#99F6E4] text-[#0F172A] hover:bg-[#7cf0dc]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-[#0B1220] text-slate-100 shadow-2xl ring-1 ring-white/10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
            CONFIRMATION
          </div>
          <div className="mt-2 text-lg font-semibold text-white">{title}</div>
          {description ? (
            <div className="mt-2 text-sm text-slate-200/70">{description}</div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/15 border border-white/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => (onConfirm ? onConfirm() : onCancel())}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


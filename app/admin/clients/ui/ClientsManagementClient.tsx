"use client";

import { useMemo, useState, useTransition } from "react";
import { addReview, deleteReview, updateReviewVisibility } from "@/actions/client-review-actions";
import { Star, Trash2 } from "lucide-react";
import { ModalDialog } from "@/app/admin/_components/ModalDialog";

type Review = Awaited<ReturnType<typeof import("@/actions/client-review-actions").getAllReviews>>[number];

function Stars({ rating }: { rating: number }) {
  const r = Math.max(1, Math.min(5, Number(rating || 5)));
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={[
            "h-4 w-4",
            i < r ? "text-amber-400 fill-amber-400" : "text-slate-300"
          ].join(" ")}
        />
      ))}
    </div>
  );
}

export function ClientsManagementClient({ initial }: { initial: Review[] }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<Review[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    clientName: "",
    role: "",
    reviewText: "",
    rating: 5
  });

  const rows = useMemo(() => items, [items]);

  function onCreate() {
    startTransition(async () => {
      await addReview({
        clientName: draft.clientName,
        role: draft.role,
        reviewText: draft.reviewText,
        rating: draft.rating
      });
      setModalOpen(false);
      setDraft({ clientName: "", role: "", reviewText: "", rating: 5 });
    });
  }

  function onToggle(id: string, next: boolean) {
    startTransition(async () => {
      await updateReviewVisibility(id, next);
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isVisible: next } : x)));
    });
  }

  function onDelete(id: string) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteReview(deleteId);
      setItems((prev) => prev.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    });
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] rounded-3xl bg-[#F9FAFB] p-6 text-slate-900 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-slate-500">CLIENT MANAGEMENT</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">Reviews &amp; Testimonials</div>
          <div className="mt-2 text-sm text-slate-600">
            Manage client relationships and public testimonials.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={pending}
          className="rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#111c33] disabled:opacity-60"
        >
          + Add New Review
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Company/Role</th>
                <th className="px-6 py-4">Review</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-slate-600">
                    No reviews yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-semibold text-slate-900">{r.clientName}</td>
                    <td className="px-6 py-4 text-slate-600">{r.role ?? "—"}</td>
                    <td className="px-6 py-4 text-slate-700">
                      <div className="max-w-[520px] truncate">{r.reviewText}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Stars rating={r.rating} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => onToggle(r.id, !r.isVisible)}
                        disabled={pending}
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                          r.isVisible
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                        ].join(" ")}
                      >
                        <span className={["h-2 w-2 rounded-full", r.isVisible ? "bg-emerald-500" : "bg-slate-400"].join(" ")} />
                        {r.isVisible ? "Live" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDelete(r.id)}
                        disabled={pending}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="text-sm font-semibold text-slate-900">Add New Review</div>
              <div className="mt-1 text-xs text-slate-500">Updates revalidate `/reviews` and `/admin/clients`.</div>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Client Name *</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.clientName}
                  onChange={(e) => setDraft((d) => ({ ...d, clientName: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Company / Role</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.role}
                  onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Review Text *</label>
                <textarea
                  className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.reviewText}
                  onChange={(e) => setDraft((d) => ({ ...d, reviewText: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Rating</label>
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  value={draft.rating}
                  onChange={(e) => setDraft((d) => ({ ...d, rating: Number(e.target.value) }))}
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="flex items-end text-xs text-slate-500">
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                  Visible by default (you can hide it after saving).
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={pending}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onCreate}
                disabled={pending || !draft.clientName.trim() || !draft.reviewText.trim()}
                className="rounded-xl bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#111c33] disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save Review"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ModalDialog
        open={Boolean(deleteId)}
        title="Delete this review?"
        description="This will remove the testimonial from the admin list and the public site."
        confirmLabel={pending ? "Deleting…" : "Delete"}
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}


"use client";

import { useEffect, useMemo, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ModalDialog } from "@/app/admin/_components/ModalDialog";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Pencil,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  UploadCloud
} from "lucide-react";
type GalleryEntry = {
  id: string;
  title: string;
  description: string | null;
  category: "RESIDENTIAL" | "COMMERCIAL";
  beforeImageUrl: string;
  afterImageUrl: string;
  matchPercentage: number | null;
  lastEdited: string;
  createdAt: string;
};

function clip(s: string, max = 110) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export function GalleryManagerClient() {
  const [openNew, setOpenNew] = useState(false);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<GalleryEntry[]>([]);

  const managedEntries = entries.length;
  const totalViews = 12400;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const canUpload = Boolean(cloudName && uploadPreset);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "RESIDENTIAL",
    matchScore: "",
    isFeatured: false
  });

  const sorted = useMemo(() => entries, [entries]);

  async function fetchEntries() {
    setLoading(true);
    const res = await fetch("/api/gallery").catch(() => null);
    if (!res || !res.ok) {
      setLoading(false);
      setError("Failed to load gallery entries.");
      return;
    }
    const data = (await res.json()) as { entries: GalleryEntry[] };
    setEntries(data.entries);
    setLoading(false);
  }

  useEffect(() => {
    void fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetNew() {
    setBeforeUrl(null);
    setAfterUrl(null);
    setForm({
      title: "",
      description: "",
      category: "RESIDENTIAL",
      matchScore: "",
      isFeatured: false
    });
  }

  async function onCreate() {
    setError(null);

    if (!beforeUrl || !afterUrl) {
      setError("Please upload both Before and After photos.");
      return;
    }

    const matchPercentage = form.matchScore ? Number(form.matchScore) : null;
    if (
      form.matchScore &&
      (matchPercentage === null ||
        Number.isNaN(matchPercentage) ||
        matchPercentage < 0 ||
        matchPercentage > 100)
    ) {
      setError("Match score must be a number between 0 and 100.");
      return;
    }

    setPending(true);
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description ? form.description : null,
        category: form.category,
        beforeImageUrl: beforeUrl,
        afterImageUrl: afterUrl,
        matchPercentage
      })
    }).catch(() => null);

    if (!res || !res.ok) {
      setPending(false);
      setError("Failed to create entry.");
      return;
    }

    setOpenNew(false);
    resetNew();
    await fetchEntries();
    setPending(false);
  }

  function onDelete(id: string) {
    setConfirmDeleteId(id);
  }

  function confirmDelete() {
    if (!confirmDeleteId) return;
    setPending(true);
    fetch(`/api/gallery/${confirmDeleteId}`, { method: "DELETE" })
      .catch(() => null)
      .then(() => fetchEntries())
      .finally(() => {
        setPending(false);
        setConfirmDeleteId(null);
      });
  }

  function onToggleFeatured(_id: string, _isFeatured: boolean) {
    // GalleryEntry model doesn't have featured flag. Keep UI toggle as visual for now.
  }

  return (
    <div className="space-y-10">
      {!canUpload ? (
        <div className="sticky top-4 z-20">
          <div className="mx-auto max-w-7xl rounded-xl bg-amber-500/10 text-amber-100 border border-amber-500/20 px-4 py-3 text-sm backdrop-blur-xl">
            Cloudinary uploads are disabled. Set{" "}
            <span className="font-mono">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</span> and{" "}
            <span className="font-mono">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</span> in{" "}
            <span className="font-mono">.env.local</span>.
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
            PORTFOLIO MANAGEMENT
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-white">Gallery Manager</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/15 border border-white/20"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
          <button
            onClick={() => setOpenNew(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#99F6E4] px-4 py-3 text-sm font-semibold text-[#0F172A] shadow-[0_16px_30px_rgba(153,246,228,0.18)] hover:bg-[#7cf0dc]"
          >
            <Plus className="h-4 w-4" />
            New Entry
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Upload zone */}
        <div className="lg:col-span-5 rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-sm border border-white/20">
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 backdrop-blur-xl p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#99F6E4]/15 text-[#99F6E4] border border-white/10">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="mt-4 text-sm font-semibold text-white">Upload Before &amp; After</div>
            <div className="mt-2 text-xs text-slate-200/70">
              Drag and drop your high-resolution PNG or JPG files here. Minimum 1920px width recommended.
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              {canUpload ? (
                <CldUploadWidget
                  uploadPreset={uploadPreset ?? ""}
                  options={{
                    multiple: false,
                    sources: ["local", "url", "camera"],
                    folder: "fsc/portfolio"
                  }}
                  onSuccess={(result) => {
                    const info = (result as any)?.info;
                    const url = info?.secure_url as string | undefined;
                    if (url) setBeforeUrl(url);
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="rounded-lg bg-white/80 glass px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-black/5 hover:bg-white"
                    >
                      Before Photo
                    </button>
                  )}
                </CldUploadWidget>
              ) : (
                <button
                  type="button"
                  className="rounded-lg bg-white/5 backdrop-blur-xl px-4 py-2 text-xs font-semibold text-slate-200/40 border border-white/10 cursor-not-allowed"
                  disabled
                >
                  Before Photo
                </button>
              )}

              {canUpload ? (
                <CldUploadWidget
                  uploadPreset={uploadPreset ?? ""}
                  options={{
                    multiple: false,
                    sources: ["local", "url", "camera"],
                    folder: "fsc/portfolio"
                  }}
                  onSuccess={(result) => {
                    const info = (result as any)?.info;
                    const url = info?.secure_url as string | undefined;
                    if (url) setAfterUrl(url);
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="rounded-lg bg-white/80 glass px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-black/5 hover:bg-white"
                    >
                      After Photo
                    </button>
                  )}
                </CldUploadWidget>
              ) : (
                <button
                  type="button"
                  className="rounded-lg bg-white/5 backdrop-blur-xl px-4 py-2 text-xs font-semibold text-slate-200/40 border border-white/10 cursor-not-allowed"
                  disabled
                >
                  After Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats + AI widget */}
        <div className="lg:col-span-7 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Eye className="h-4 w-4" />
                Total Portfolio Views
              </div>
              <div className="h-8 w-8 rounded-xl bg-[#99F6E4]/15 flex items-center justify-center text-[#99F6E4] border border-white/10">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-6 text-4xl font-semibold text-white">
              {(totalViews / 1000).toFixed(1)}k
            </div>
            <div className="mt-1 text-xs text-slate-200/60">Total Portfolio Views</div>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-sm border border-white/20 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Managed Entries
              </div>
              <div className="h-8 w-8 rounded-xl bg-[#99F6E4]/15 flex items-center justify-center text-[#99F6E4] border border-white/10">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-6 text-4xl font-semibold">{managedEntries}</div>
            <div className="mt-1 text-xs text-slate-200/60">Managed Entries</div>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-white/10 backdrop-blur-xl p-6 shadow-sm border border-white/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#99F6E4]/15 text-[#99F6E4] border border-white/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Enhancement Ready</div>
                <div className="text-xs text-slate-200/60">
                  3 new uploads are ready for automatic color correction.
                </div>
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-[#99F6E4] hover:text-white underline underline-offset-4"
            >
              Review Now
            </button>
          </div>
        </div>
      </div>

      {openNew ? (
        <div className="mt-8 rounded-2xl bg-white p-6 text-slate-900 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Create new entry</div>
              <div className="mt-1 text-xs text-slate-500">
                Upload Before &amp; After photos, then fill details.
              </div>
            </div>
            <button
              onClick={() => {
                setOpenNew(false);
                resetNew();
              }}
              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Close
            </button>
          </div>

          {!canUpload ? (
            <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-slate-900 border border-amber-200">
              Cloudinary upload is not configured. Set{" "}
              <span className="font-mono">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</span> and{" "}
              <span className="font-mono">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</span> in{" "}
              <span className="font-mono">.env.local</span>.
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-semibold tracking-[0.22em] text-slate-600">
                BEFORE PHOTO
              </div>
              <div className="mt-3">
                {canUpload ? (
                  <CldUploadWidget
                    uploadPreset={uploadPreset ?? ""}
                    options={{
                      multiple: false,
                      sources: ["local", "url", "camera"],
                      folder: "fsc/portfolio"
                    }}
                    onSuccess={(result) => {
                      const info = (result as any)?.info;
                      const url = info?.secure_url as string | undefined;
                      if (url) setBeforeUrl(url);
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-black/5 hover:bg-slate-50"
                      >
                        Drag & drop or click to upload
                      </button>
                    )}
                  </CldUploadWidget>
                ) : (
                  <button
                    type="button"
                    className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-black/5 cursor-not-allowed"
                    disabled
                  >
                    Upload disabled (missing Cloudinary env)
                  </button>
                )}
              </div>
              {beforeUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-black/5">
                  <Image
                    src={beforeUrl}
                    alt="Before"
                    width={800}
                    height={600}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-semibold tracking-[0.22em] text-slate-600">
                AFTER PHOTO
              </div>
              <div className="mt-3">
                {canUpload ? (
                  <CldUploadWidget
                    uploadPreset={uploadPreset ?? ""}
                    options={{
                      multiple: false,
                      sources: ["local", "url", "camera"],
                      folder: "fsc/portfolio"
                    }}
                    onSuccess={(result) => {
                      const info = (result as any)?.info;
                      const url = info?.secure_url as string | undefined;
                      if (url) setAfterUrl(url);
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-black/5 hover:bg-slate-50"
                      >
                        Drag & drop or click to upload
                      </button>
                    )}
                  </CldUploadWidget>
                ) : (
                  <button
                    type="button"
                    className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400 shadow-sm ring-1 ring-black/5 cursor-not-allowed"
                    disabled
                  >
                    Upload disabled (missing Cloudinary env)
                  </button>
                )}
              </div>
              {afterUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-black/5">
                  <Image
                    src={afterUrl}
                    alt="After"
                    width={800}
                    height={600}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-600">
                TITLE
              </label>
              <input
                className="mt-2 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-slate-900/10"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-600">
                CATEGORY
              </label>
              <select
                className="mt-2 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-slate-900/10"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="COMMERCIAL">COMMERCIAL</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-600">
                MATCH SCORE (OPTIONAL)
              </label>
              <input
                className="mt-2 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-slate-900/10"
                value={form.matchScore}
                onChange={(e) => setForm((f) => ({ ...f, matchScore: e.target.value }))}
                placeholder="98"
                inputMode="numeric"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Featured on website
              </label>
            </div>

            <div className="lg:col-span-2">
              <label className="text-[11px] font-semibold tracking-[0.22em] text-slate-600">
                DESCRIPTION (OPTIONAL)
              </label>
              <textarea
                className="mt-2 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none ring-1 ring-transparent focus:ring-slate-900/10"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => resetNew()}
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              disabled={pending}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => onCreate()}
              className="rounded-xl bg-slateNavy px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              disabled={pending}
            >
              {pending ? "Saving…" : "Create Entry"}
            </button>
          </div>
        </div>
      ) : null}

      <div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-white">Managed Portfolio Entries</div>
          <div className="flex items-center gap-3 text-xs text-slate-200/60">
            <div>Showing {Math.min(sorted.length, 6)} of {sorted.length} entries</div>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-slate-200">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-slate-200">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      {loading ? (
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 text-center text-slate-200/70">
          Loading entries…
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 text-center">
          <div className="text-lg font-semibold text-white">No entries found.</div>
          <div className="mt-2 text-sm text-slate-200/70">
            Start by adding your first restoration.
          </div>
        </div>
      ) : (
      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((e) => (
          <div key={e.id} className="group overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl shadow-sm border border-white/20">
            <div className="grid grid-cols-2 gap-px bg-white/10">
              <div className="relative h-44 bg-slate-100">
                <Image
                  src={e.beforeImageUrl}
                  alt={`${e.title} (Before)`}
                  fill
                  sizes="(max-width: 1200px) 50vw, 16vw"
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold tracking-[0.22em] text-white ring-1 ring-white/10">
                  BEFORE
                </div>
              </div>
              <div className="relative h-44 bg-slate-100">
                <Image
                  src={e.afterImageUrl}
                  alt={`${e.title} (After)`}
                  fill
                  sizes="(max-width: 1200px) 50vw, 16vw"
                  className="object-cover"
                />
                <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold tracking-[0.22em] text-white ring-1 ring-white/10">
                  AFTER
                </div>
              </div>
              <div className="absolute left-4 top-4 rounded-full bg-ocean-slate/85 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-white ring-1 ring-white/10">
                {e.category}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{e.title}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 p-2 text-slate-200 hover:bg-white/15 border border-white/10"
                    title="Edit (coming soon)"
                    onClick={() => setInfoOpen(true)}
                    disabled={pending}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-red-500/10 p-2 text-red-200 hover:bg-red-500/15 border border-red-500/20"
                    title="Delete"
                    onClick={() => onDelete(e.id)}
                    disabled={pending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {e.description ? (
                <div className="mt-3 text-sm text-slate-200/80">{clip(e.description)}</div>
              ) : null}

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="text-[10px] font-semibold tracking-[0.22em] text-slate-200/50">
                  LAST EDITED: {new Date(e.lastEdited).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  {typeof e.matchPercentage === "number" ? (
                    <div className="text-[11px] font-semibold text-slate-200/80">
                      {e.matchPercentage}% Match
                    </div>
                  ) : null}
                <button
                  type="button"
                    onClick={() => onToggleFeatured(e.id, false)}
                  className={`h-6 w-12 rounded-full relative ${
                    false ? "bg-[#99F6E4]/40" : "bg-white/15"
                  }`}
                  disabled={pending}
                  aria-label="Toggle featured"
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      false ? "left-[26px]" : "left-[2px]"
                    }`}
                  />
                </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      </div>

      <ModalDialog
        open={Boolean(confirmDeleteId)}
        title="Delete this portfolio entry?"
        description="This will permanently remove the entry and its images from the gallery list."
        confirmLabel={pending ? "Deleting…" : "Delete"}
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <ModalDialog
        open={infoOpen}
        title="Edit is coming soon"
        description="The edit workflow will be added next. Delete is available now."
        confirmLabel="OK"
        cancelLabel="Close"
        variant="default"
        onCancel={() => setInfoOpen(false)}
        onConfirm={() => setInfoOpen(false)}
      />
    </div>
  );
}


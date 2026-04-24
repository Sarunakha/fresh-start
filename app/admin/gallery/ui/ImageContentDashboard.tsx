"use client";

import { useMemo, useState, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Image as ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { ModalDialog } from "@/app/admin/_components/ModalDialog";
import {
  WEBSITE_ASSET_DEFINITIONS,
  type WebsiteAssetPage
} from "@/lib/website-asset-keys";
import {
  deleteWebsiteAsset,
  upsertWebsiteAsset
} from "@/actions/website-asset-actions";
import { toOptimizedCloudinaryUrl } from "@/lib/cloudinary-delivery";

type Row = {
  id: string;
  sectionKey: string;
  cloudinaryUrl: string;
  altText: string;
};

export function ImageContentDashboard({ initial }: { initial: Row[] }) {
  const [pending, startTransition] = useTransition();
  const [byKey, setByKey] = useState<Record<string, Row>>(() =>
    Object.fromEntries(initial.map((r) => [r.sectionKey, r]))
  );
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.map((r) => [r.sectionKey, r.altText]))
  );
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.map((r) => [r.sectionKey, r.cloudinaryUrl]))
  );

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const canUpload = Boolean(cloudName && uploadPreset);

  const grouped = useMemo(() => {
    const pages: WebsiteAssetPage[] = ["Home", "About", "Reviews"];
    return pages.map((page) => ({
      page,
      items: WEBSITE_ASSET_DEFINITIONS.filter((d) => d.page === page)
    }));
  }, []);

  function onUploaded(sectionKey: string, url: string) {
    const optimized = toOptimizedCloudinaryUrl(url);
    const alt = altDrafts[sectionKey]?.trim() || undefined;
    startTransition(async () => {
      await upsertWebsiteAsset({
        sectionKey,
        cloudinaryUrl: optimized,
        altText: alt
      });
      setByKey((prev) => ({
        ...prev,
        [sectionKey]: {
          id: prev[sectionKey]?.id ?? sectionKey,
          sectionKey,
          cloudinaryUrl: optimized,
          altText:
            alt ??
            prev[sectionKey]?.altText ??
            "Fresh Start Facility Solutions Sydney Image"
        }
      }));
      setUrlDrafts((d) => ({ ...d, [sectionKey]: optimized }));
    });
  }

  function onDelete(sectionKey: string) {
    setDeleteKey(sectionKey);
  }

  function confirmDelete() {
    if (!deleteKey) return;
    startTransition(async () => {
      await deleteWebsiteAsset(deleteKey);
      setByKey((prev) => {
        const next = { ...prev };
        delete next[deleteKey];
        return next;
      });
      setUrlDrafts((d) => {
        const next = { ...d };
        delete next[deleteKey];
        return next;
      });
      setDeleteKey(null);
    });
  }

  function saveAlt(sectionKey: string) {
    const row = byKey[sectionKey];
    if (!row) return;
    startTransition(async () => {
      await upsertWebsiteAsset({
        sectionKey,
        cloudinaryUrl: row.cloudinaryUrl,
        altText: altDrafts[sectionKey]
      });
    });
  }

  function saveUrl(sectionKey: string) {
    const nextUrl = (urlDrafts[sectionKey] ?? "").trim();
    startTransition(async () => {
      await upsertWebsiteAsset({
        sectionKey,
        cloudinaryUrl: nextUrl,
        altText: altDrafts[sectionKey] ?? "Fresh Start Facility Solutions Sydney Image"
      });
      setByKey((prev) => ({
        ...prev,
        [sectionKey]: {
          id: prev[sectionKey]?.id ?? sectionKey,
          sectionKey,
          cloudinaryUrl: nextUrl,
          altText: altDrafts[sectionKey] ?? prev[sectionKey]?.altText ?? "Fresh Start Facility Solutions Sydney Image"
        }
      }));
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/60">
            IMAGE CONTENT
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Website Image Content Manager
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200/70">
            Map Cloudinary images to page sections. Uploads use your unsigned
            preset; URLs are stored with{" "}
            <span className="font-mono text-slate-200">f_auto,q_auto</span> for
            fast delivery.
          </p>
        </div>
      </div>

      {!canUpload ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Set{" "}
          <span className="font-mono">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</span>{" "}
          and{" "}
          <span className="font-mono">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</span>{" "}
          in <span className="font-mono">.env.local</span> to enable uploads.
        </div>
      ) : null}

      {grouped.map(({ page, items }) => (
        <section key={page} className="space-y-4">
          <div className="text-xs font-semibold tracking-[0.28em] text-slate-200/50">
            {page.toUpperCase()}
          </div>
          <div className="grid gap-4">
            {items.map((def) => {
              const row = byKey[def.sectionKey];
              const src = row?.cloudinaryUrl;
              const isSocialUrl = def.sectionKey === "SOCIAL_INSTAGRAM_URL";
              return (
                <div
                  key={def.sectionKey}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                    {isSocialUrl ? (
                      <div className="w-full rounded-xl bg-black/20 ring-1 ring-white/10 lg:w-48 lg:shrink-0 p-4">
                        <div className="text-xs font-semibold tracking-[0.22em] text-slate-200/60">
                          LINK
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">
                          Instagram
                        </div>
                        <div className="mt-1 text-xs text-slate-200/60">
                          Used by the marketing site footer icon.
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-black/20 ring-1 ring-white/10 lg:h-32 lg:w-48 lg:shrink-0">
                        {src ? (
                          <Image
                            src={src}
                            alt={altDrafts[def.sectionKey] || def.label}
                            fill
                            className="object-cover"
                            sizes="192px"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-400">
                            <ImageIcon className="h-8 w-8 opacity-50" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        <div className="font-semibold text-white">{def.label}</div>
                        <div className="mt-1 font-mono text-xs text-slate-400">
                          {def.sectionKey}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">{def.hint}</div>
                      </div>

                      {isSocialUrl ? (
                        <div>
                          <label className="text-xs font-semibold text-slate-300">
                            Instagram URL
                          </label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <input
                              className="min-w-[240px] flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                              value={urlDrafts[def.sectionKey] ?? ""}
                              onChange={(e) =>
                                setUrlDrafts((d) => ({
                                  ...d,
                                  [def.sectionKey]: e.target.value
                                }))
                              }
                              placeholder="https://instagram.com/yourhandle"
                            />
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => saveUrl(def.sectionKey)}
                              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15 disabled:opacity-40"
                            >
                              Save link
                            </button>
                          </div>
                        </div>
                      ) : null}

                      <div>
                        <label className="text-xs font-semibold text-slate-300">
                          Alt text
                        </label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <input
                            className="min-w-[200px] flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                            value={altDrafts[def.sectionKey] ?? ""}
                            onChange={(e) =>
                              setAltDrafts((d) => ({
                                ...d,
                                [def.sectionKey]: e.target.value
                              }))
                            }
                          />
                          <button
                            type="button"
                            disabled={pending || !row}
                            onClick={() => saveAlt(def.sectionKey)}
                            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15 disabled:opacity-40"
                          >
                            Save alt
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {isSocialUrl ? null : canUpload ? (
                          <CldUploadWidget
                            uploadPreset={uploadPreset ?? ""}
                            options={{
                              sources: ["local", "url", "camera"],
                              multiple: false,
                              maxFiles: 1,
                              clientAllowedFormats: ["image"],
                              maxImageFileSize: 12000000,
                              folder: "fsc/website"
                            }}
                            onSuccess={(result) => {
                              const info = (result as any)?.info;
                              const url = info?.secure_url as string | undefined;
                              if (url) onUploaded(def.sectionKey, url);
                            }}
                          >
                            {({ open }) => (
                              <button
                                type="button"
                                disabled={pending}
                                onClick={() => open()}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#99F6E4] px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#7cf0dc] disabled:opacity-60"
                              >
                                <UploadCloud className="h-4 w-4" />
                                Upload / replace
                              </button>
                            )}
                          </CldUploadWidget>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-400"
                          >
                            <UploadCloud className="h-4 w-4" />
                            Upload disabled
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={pending || !row}
                          onClick={() => onDelete(def.sectionKey)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/20 disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <ModalDialog
        open={Boolean(deleteKey)}
        title="Remove this image?"
        description="This will remove the image from the public website (the page will fall back to the default placeholder)."
        confirmLabel={pending ? "Removing…" : "Remove"}
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => setDeleteKey(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

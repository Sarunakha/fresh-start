import { useEffect, useState } from "react";

export type WebsiteAssetMap = Record<
  string,
  { cloudinaryUrl: string; altText: string }
>;

const FALLBACK: WebsiteAssetMap = {};

export function useWebsiteAssets() {
  const [assetsByKey, setAssetsByKey] = useState<WebsiteAssetMap>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/website-assets", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { assetsByKey?: WebsiteAssetMap };
        if (!cancelled) setAssetsByKey(data.assetsByKey ?? {});
      } catch {
        if (!cancelled) setAssetsByKey({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return assetsByKey;
}

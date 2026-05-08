"use client";

import { useWebsiteAssets } from "@/hooks/useWebsiteAssets";
import { WEBSITE_ASSET_KEYS } from "@/constants/websiteAssets";

const TRANSFORMATION_KEYS = [
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_1,
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_2,
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_3,
  WEBSITE_ASSET_KEYS.CLIENTS_TRANSFORMATION_4
] as const;

const TRANSFORMATION_FALLBACK_BG = [
  "bg-white",
  "bg-clinical-navy",
  "bg-clinical-aqua",
  "bg-white"
] as const;

export function ReviewsTransformationGrid() {
  const assets = useWebsiteAssets();

  return (
    <div className="grid grid-cols-2 gap-4">
      {TRANSFORMATION_KEYS.map((key, i) => {
        const row = assets[key];
        const url = row?.cloudinaryUrl;
        return (
          <div
            key={key}
            className={`relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-black/5 ${TRANSFORMATION_FALLBACK_BG[i]}`}
          >
            {url ? (
              <img
                src={url}
                alt={row?.altText ?? "Transformation showcase"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}


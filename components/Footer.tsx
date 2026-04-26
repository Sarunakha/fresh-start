"use client";

import Link from "next/link";
import { Camera, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useWebsiteAssets } from "@/hooks/useWebsiteAssets";
import { WEBSITE_ASSET_KEYS } from "@/constants/websiteAssets";

export function Footer() {
  const assets = useWebsiteAssets();
  const rawInstagramUrl = assets[WEBSITE_ASSET_KEYS.SOCIAL_INSTAGRAM_URL]?.cloudinaryUrl?.trim();
  const instagramUrl = rawInstagramUrl
    ? rawInstagramUrl.startsWith("http://") || rawInstagramUrl.startsWith("https://")
      ? rawInstagramUrl
      : `https://${rawInstagramUrl}`
    : "https://www.instagram.com/heraldcollegektm";

  return (
    <footer className="mt-24 bg-clinical-navy text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-3 md:items-start">
        <div>
          <div className="text-sm font-semibold tracking-wide">Fresh Start Facility Solutions Sydney</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-4 w-4" />
            Premium, clinical-grade protocols.
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
          <Link className="hover:text-white" href="/">
            Home
          </Link>
          <Link className="hover:text-white" href="/about">
            About Us
          </Link>
          <Link className="hover:text-white" href="/reviews">
            Reviews
          </Link>
          <Link className="hover:text-white" href="/services">
            Services
          </Link>
          <Link className="hover:text-white" href="/book">
            Get a Quote
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} Fresh Start Facility Solutions. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <a
              className="hover:text-white"
              href={instagramUrl}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Camera className="h-5 w-5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}


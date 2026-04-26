"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Props = {
  /** When true, keep logo invisible so splash can merge into it. */
  hideLogo?: boolean;
};

const navLinkBase =
  "text-sm tracking-wide text-clinical-charcoal/80 hover:text-clinical-charcoal transition";

export function Navbar({ hideLogo }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-clinical-white/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
          <motion.span
            layoutId="main-logo"
            className={hideLogo ? "opacity-0" : "opacity-100"}
          >
            <Image
              src="/logo.svg"
              alt="Fresh Start Facility Solutions Sydney"
              width={320}
              height={72}
              className="h-[72px] w-auto max-w-[320px] object-contain"
              priority
              unoptimized
            />
          </motion.span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className={`${navLinkBase} ${isActive("/") ? "text-clinical-charcoal" : ""}`}>
              Home
            </Link>
            <Link
              href="/about"
              className={`${navLinkBase} ${isActive("/about") ? "text-clinical-charcoal" : ""}`}
            >
              About Us
            </Link>
            <Link
              href="/reviews"
              className={`${navLinkBase} ${isActive("/reviews") ? "text-clinical-charcoal" : ""}`}
            >
              Reviews
            </Link>
            <Link
              href="/services"
              className={`${navLinkBase} ${isActive("/services") ? "text-clinical-charcoal" : ""}`}
            >
              Services
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-xl bg-clinical-aqua px-4 py-2 text-sm font-medium text-clinical-navy shadow-clinicalSm hover:brightness-[0.98]"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}


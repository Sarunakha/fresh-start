"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";

type Props = {
  /** When true, keep logo invisible so splash can merge into it. */
  hideLogo?: boolean;
};

const navLinkBase =
  "text-sm tracking-wide text-clinical-charcoal/80 hover:text-clinical-charcoal transition";

export function Navbar({ hideLogo }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogTitleId = useId();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    // Close mobile menu on navigation.
    setMobileOpen(false);
  }, [pathname]);

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
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-clinical-navy shadow-sm backdrop-blur hover:bg-white md:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/get-a-quote"
            className="hidden items-center justify-center rounded-xl bg-clinical-aqua px-4 py-2 text-sm font-medium text-clinical-navy shadow-clinicalSm hover:brightness-[0.98] md:inline-flex"
          >
            Get a Quote
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-labelledby={dialogTitleId}>
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <div id={dialogTitleId} className="text-sm font-semibold tracking-wide text-clinical-navy">
                Menu
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-clinical-navy hover:bg-slate-50"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-5 py-5">
              <div className="grid gap-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/reviews", label: "Reviews" },
                  { href: "/services", label: "Services" }
                ].map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "rounded-xl px-4 py-3 text-sm font-semibold",
                        active
                          ? "bg-clinical-lavender text-clinical-navy"
                          : "text-clinical-charcoal/85 hover:bg-black/[0.03] hover:text-clinical-charcoal"
                      ].join(" ")}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/get-a-quote"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-clinical-aqua px-4 py-3 text-sm font-semibold text-clinical-navy shadow-clinicalSm hover:brightness-[0.98]"
                onClick={() => setMobileOpen(false)}
              >
                Get a Quote
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}


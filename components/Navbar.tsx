"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  /** When true, keep logo invisible so splash can merge into it. */
  hideLogo?: boolean;
};

export function Navbar({ hideLogo }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
        <Link href="/" className="flex items-center">
          <motion.span
            layoutId="main-logo"
            className={`inline-flex items-center ${hideLogo ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          >
            <Image
              src="/logo.svg"
              alt="Fresh Start Facility Solutions"
              width={200}
              height={48}
              className="h-10 w-auto object-contain"
              priority
              unoptimized
            />
          </motion.span>
        </Link>
        <nav className="ml-auto hidden items-center gap-8 text-sm font-semibold text-[#0A1922] md:flex">
          <Link href="/about" className="hover:text-[#0A1922]/70">
            About
          </Link>
          <Link href="/services" className="hover:text-[#0A1922]/70">
            Services
          </Link>
          <Link href="/reviews" className="hover:text-[#0A1922]/70">
            Reviews
          </Link>
          <Link
            href="/book"
            className="rounded-xl bg-[#0A1922] px-4 py-2 text-white hover:bg-[#0A1922]/90"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
      <div className="h-px w-full bg-[#0A1922]/10" />
    </header>
  );
}


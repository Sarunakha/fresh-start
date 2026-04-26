"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { SplashScreen } from "./SplashScreen";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Footer } from "./Footer";

const SESSION_KEY = "fsc:splashShown";

export function SplashGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setShowSplash(false);
      return;
    }
    try {
      const already = sessionStorage.getItem(SESSION_KEY) === "1";
      setShowSplash(!already);
    } catch {
      setShowSplash(false);
    }
  }, [isAdmin]);

  const onDone = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setShowSplash(false);
  };

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-clinical-white text-clinical-navy">
      <LayoutGroup>
        <Navbar hideLogo={showSplash} />
        <main className={showSplash ? "opacity-0 pointer-events-none select-none" : "opacity-100"}>
          {children}
        </main>
        <Footer />
        <AnimatePresence>
          {showSplash ? <SplashScreen onDone={onDone} /> : null}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}


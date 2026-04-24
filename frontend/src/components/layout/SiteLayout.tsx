import type { PropsWithChildren } from "react";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";
import { SplashGate } from "../splash/SplashGate";

export function SiteLayout({ children }: PropsWithChildren) {
  return (
    <SplashGate>
      {({ showSplash }) => (
        <div className="min-h-dvh bg-clinical-white">
          <NavBar hideLogo={showSplash} />
          <main className={showSplash ? "opacity-0 pointer-events-none select-none" : "opacity-100"}>
            {children}
          </main>
          <Footer />
        </div>
      )}
    </SplashGate>
  );
}


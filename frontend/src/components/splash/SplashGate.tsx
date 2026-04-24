"use client";

import { useEffect, useState } from "react";
import { SplashScreen } from "./SplashScreen";
import { AnimatePresence, LayoutGroup } from "framer-motion";

const SESSION_KEY = "fsc:splashShown";

export function SplashGate({
  children
}: {
  children: (args: { showSplash: boolean }) => React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Start hidden on SSR; enable after mount.
    return false;
  });

  useEffect(() => {
    try {
      const already = sessionStorage.getItem(SESSION_KEY) === "1";
      setShowSplash(!already);
    } catch {
      setShowSplash(false);
    }
  }, []);

  const onDone = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setShowSplash(false);
  };

  return (
    <LayoutGroup>
      {children({ showSplash })}
      <AnimatePresence>{showSplash ? <SplashScreen onDone={onDone} /> : null}</AnimatePresence>
    </LayoutGroup>
  );
}


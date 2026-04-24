"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  onDone: () => void;
  logoSrc?: string;
};

export function SplashScreen({
  onDone,
  logoSrc = "/logo.svg"
}: Props) {
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  return (
    <motion.div
      className={`fixed inset-0 z-50 bg-white ${exiting ? "pointer-events-none" : ""}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      }}
    >
      <motion.img
        layoutId="main-logo"
        src={logoSrc}
        alt="Fresh Start Facility Solutions"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(520px,78vw)] -translate-x-1/2 -translate-y-1/2 select-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }}
      />
      {/** Trigger travel by unmounting after brief entrance. */}
      <SplashAutoDone
        onDone={() => {
          if (doneRef.current) return;
          doneRef.current = true;
          setExiting(true);
          onDone();
        }}
      />
    </motion.div>
  );
}

function SplashAutoDone({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2000);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return null;
}


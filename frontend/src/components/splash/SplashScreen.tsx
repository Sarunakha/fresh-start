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

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      setExiting(true);
      onDone();
    }, 2000);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] bg-white ${exiting ? "pointer-events-none" : ""}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <motion.img
          layoutId="main-logo"
          src={logoSrc}
          alt="Fresh Start Facility Solutions"
          className="pointer-events-none w-[min(520px,78vw)] select-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          }}
        />
      </div>
    </motion.div>
  );
}


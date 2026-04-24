import type { PropsWithChildren } from "react";
import { cn } from "../../lib/cn";

export function Container({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}


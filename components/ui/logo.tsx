import Image from "next/image";
import mark from "@/public/tribe-mark.png";

export const BRAND = "Tribe";

/* The logo is icon.png itself. The artwork already carries the wordmark, so
   there is no separate type set beside it, and the source has a transparent
   background so it sits on any surface without a plate behind it.

   `tone="white"` knocks the artwork out to solid white for dark backgrounds —
   the full-colour mark would lose its purple against a purple band. */
export function Logo({
  className = "h-12",
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "white";
}) {
  return (
    <Image
      src={mark}
      alt={BRAND}
      priority
      className={`w-auto ${tone === "white" ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}

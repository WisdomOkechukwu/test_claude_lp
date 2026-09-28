import Image from "next/image";
import type { ReactNode } from "react";

/* The photo-plus-scrim block, which used to be copy-pasted into six sections
   with three different scrims — including a purple→orange gradient in
   ease-of-use that the brand rules had already ruled out. One component now
   owns the treatment so it cannot drift again.

   Text placed inside is always white, so the scrim is what carries the
   contrast: it has to stay dark enough that white type clears 4.5:1 over the
   brightest part of the photograph underneath. That is why the scrim is a
   fixed set rather than a free prop — an arbitrary `bg-plum/40` would compile
   fine and fail on contrast. */
const SCRIMS = {
  /* The documented default. Safe for white type over any photo here. */
  base: "bg-plum/75",
  /* For headings sitting directly on a bright or busy frame. */
  deep: "bg-plum/85",
  /* Only where nothing but a mockup sits on top — no text to protect. */
  soft: "bg-plum/60",
  /* No scrim at all. Valid only for a photograph that is already light enough
     to sit on the white page unaided and carries no type — the hero flat-lay
     is the one case. Anything with white text on it must not use this. */
  none: "",
} as const;

export type Scrim = keyof typeof SCRIMS;

export function PhotoPanel({
  src,
  alt = "",
  sizes,
  priority = false,
  scrim = "base",
  rounded = "rounded-2xl",
  ring = true,
  className = "",
  imageClassName = "",
  children,
}: {
  src: string;
  /* Empty alt marks the photo decorative — the default, since these are
     scenery behind copy that already says the thing. Pass real alt text only
     when the photograph itself carries information. */
  alt?: string;
  sizes: string;
  priority?: boolean;
  scrim?: Scrim;
  /* Off for a photo that bleeds into the page rather than sitting in a card. */
  ring?: boolean;
  rounded?: string;
  className?: string;
  /* Steers the crop — `object-left`, `object-top` and so on. object-cover on a
     panel whose aspect differs from the file's will otherwise centre-crop and
     can cut the subject straight out of the frame. */
  imageClassName?: string;
  children?: ReactNode;
}) {
  const decorative = alt === "";

  return (
    <div
      className={`relative isolate overflow-hidden ${rounded} ${
        ring ? "ring-1 ring-line" : ""
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        aria-hidden={decorative || undefined}
        fill
        priority={priority}
        sizes={sizes}
        className={`-z-20 object-cover ${imageClassName}`}
      />
      {scrim !== "none" && (
        <div aria-hidden="true" className={`absolute inset-0 -z-10 ${SCRIMS[scrim]}`} />
      )}
      {children}
    </div>
  );
}

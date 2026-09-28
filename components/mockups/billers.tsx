"use client";

import Image from "next/image";

import { Bolt, Phone, Tv, Wifi } from "@/components/ui/icons";

/* The six providers the section shows, each with its own mark.

   The files come from `assetx/` in this repo, copied into `public/img/billers/`
   — nothing under `assetx/` is served, so it has to be copied rather than
   referenced. Every one is a square brand tile with the background already
   baked in (no alpha), which is why the tile renders the image *as* the tile
   rather than laying a transparent mark over a brand colour.

   `hex`/`on` survive as the fallback for a biller with no file yet: the name
   set on the brand colour. Nothing uses it today — all six have marks.

   Six, not ten. The rest are in the app, and a wall of every biller on a
   marketing page is a directory nobody reads. */
export const BILLERS = [
  { name: "MTN", icon: Phone, amount: 82_000, detail: "240 staff lines", category: "Airtime", hex: "#FFCC00", on: "ink", logo: "/img/billers/mtn.png" },
  { name: "Airtel", icon: Phone, amount: 46_500, detail: "138 staff lines", category: "Airtime", hex: "#E4022D", on: "white", logo: "/img/billers/airtel.png" },
  { name: "Glo", icon: Wifi, amount: 31_000, detail: "92 data bundles", category: "Data", hex: "#50B848", on: "ink", logo: "/img/billers/glo.png" },
  { name: "9mobile", icon: Phone, amount: 18_400, detail: "54 staff lines", category: "Airtime", hex: "#006F51", on: "white", logo: "/img/billers/9mobile.png" },
  { name: "DStv", icon: Tv, amount: 29_500, detail: "7 branch offices", category: "Cable", hex: "#0C2E82", on: "white", logo: "/img/billers/dstv.jpg" },
  { name: "PHED", icon: Bolt, amount: 145_000, detail: "3 meters", category: "Electricity", hex: "#0B4F9E", on: "white", logo: "/img/billers/phed.png" },
] as const;

export type Biller = (typeof BILLERS)[number];

/* A wall of provider marks, with an honest seventh tile.

   The marks are square brand tiles with their own backgrounds, so each one is
   the tile — no brand-colour box behind a transparent logo, which would have
   doubled the background on every one of them. A biller with no file falls back
   to its name on its brand colour.

   Not selectable. It says who we pay; paying one happens in the app. A control
   that looks tappable and leads nowhere is worse than a label. */
export function BillerWall({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 ${className}`}
    >
      {BILLERS.map(({ name, category, hex, on, logo }) => (
        <li key={name} className="min-w-0">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={200}
              height={200}
              sizes="(max-width: 640px) 45vw, 160px"
              className="aspect-square w-full rounded-2xl object-cover ring-1 ring-line"
            />
          ) : (
            <span
              className="grid aspect-square w-full place-items-center rounded-2xl px-3 ring-1 ring-line"
              style={{ backgroundColor: hex }}
            >
              <span
                className={`truncate text-[15px] font-extrabold tracking-tight ${
                  on === "white" ? "text-white" : "text-ink"
                }`}
              >
                {name}
              </span>
            </span>
          )}
          <p className="mt-2 truncate text-center text-[12px] font-semibold text-muted">
            {category}
          </p>
        </li>
      ))}

      <li className="min-w-0">
        <p className="grid aspect-square w-full place-items-center rounded-2xl border border-dashed border-line px-3 text-center">
          <span className="text-[15px] font-extrabold tracking-tight text-brand">
            40+ more
          </span>
        </p>
        <p className="mt-2 truncate text-center text-[12px] font-semibold text-muted">
          In the app
        </p>
      </li>
    </ul>
  );
}

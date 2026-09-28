/* Brand metadata for the gift card rail — names, colours, and which
   foreground clears contrast on them. **No path geometry lives here.**

   The glyphs are in `brand-paths.ts`, which only `BrandSprite` imports. That
   split matters: `giftcard-trade.tsx` is a client component, so anything it
   receives as a prop is serialised into the RSC payload. Passing the whole
   brand object — 7.6KB of Starbucks siren included — put the geometry in the
   HTML once per card and again in the flight data, and took the home page
   from 221KB to 304KB.

   The trademarks belong to their owners. They appear here to identify the
   cards Tribe actually converts, which is what `components/disclaimer.tsx`
   already says in words. Glyphs are from simple-icons, CC0-1.0.

   simple-icons has *removed* Amazon, Xbox, Sephora and Nordstrom at those
   companies' request, so their marks have no openly-licensed source. Those
   four were swapped out rather than drawn from memory.

   `ink` and `hex` are measured, not styled. Each official colour was checked
   against white and against `--color-ink` and the better foreground recorded —
   Spotify green and iTunes pink both fail white. Where neither cleared 4.5:1
   the colour was darkened until one did, noted inline. */

export type Brand = {
  name: string;
  hex: string;
  ink: "white" | "ink";
};

export const BRANDS = {
  steam: {
    name: "Steam",
    hex: "#000000",
    ink: "white",
    /* 21.00:1 */
  },
  itunes: {
    name: "iTunes",
    hex: "#FB5BC5",
    ink: "ink",
    /* 6.79:1 */
  },
  googleplay: {
    name: "Google Play",
    hex: "#414141",
    ink: "white",
    /* 10.21:1 */
  },
  netflix: {
    name: "Netflix",
    hex: "#E50914",
    ink: "white",
    /* 4.79:1 */
  },
  playstation: {
    name: "PlayStation",
    hex: "#0070D1",
    ink: "white",
    /* 4.95:1 */
  },
  spotify: {
    name: "Spotify",
    hex: "#1ED760",
    ink: "ink",
    /* 10.04:1 */
  },
  ebay: {
    name: "eBay",
    hex: "#E03137",
    ink: "white",
    /* 4.50:1 darkened from #E53238 to clear 4.5:1 */
  },
  nike: {
    name: "Nike",
    hex: "#111111",
    ink: "white",
    /* 18.88:1 */
  },
  roblox: {
    name: "Roblox",
    hex: "#000000",
    ink: "white",
    /* 21.00:1 */
  },
  target: {
    name: "Target",
    hex: "#CC0000",
    ink: "white",
    /* 5.89:1 */
  },
} satisfies Record<string, Brand>;

export type BrandKey = keyof typeof BRANDS;

/* References a symbol from <BrandSprite />, which app/layout.tsx renders once
   per document. Carries no geometry itself. */
export function BrandLogo({
  brandKey,
  className = "",
}: {
  brandKey: BrandKey;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <use href={`#bl-${brandKey}`} />
    </svg>
  );
}

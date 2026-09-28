import { BRAND_PATHS } from "@/components/brand-paths";

/* Defines every gift card glyph once per document; the cards reference them by
   id through <BrandLogo>. Rendered from app/layout.tsx.

   Twenty-one cards inlining their own copy of the geometry cost six Lighthouse
   points — LCP 3125ms to 3586ms, TBT 91ms to 218ms — so this is not just tidy,
   it is the reason the rail is affordable. */
export function BrandSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        {Object.entries(BRAND_PATHS).map(([key, d]) => (
          <symbol key={key} id={`bl-${key}`} viewBox="0 0 24 24">
            <path d={d} />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

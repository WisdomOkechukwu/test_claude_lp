import { Container } from "@/components/ui/section";
import { GiftCardFace } from "@/components/art";
import { type BrandKey } from "@/components/brand-logos";

/* Was a rail of large saturated gradient discs, then a row of hairline text
   chips about 40px tall, which read as tags rather than as cards. Now the
   actual object: each brand's own mark on its own colour.

   Those four brands you might expect and cannot find — Amazon, Xbox, Sephora,
   Nordstrom — have had their marks removed from simple-icons at their own
   request, so there is no openly-licensed source for them. They were swapped
   out for brands whose marks are available rather than approximated by hand.
   See the note in brand-logos.tsx.

   No denominations here. This rail says which brands we take; a figure on it
   would read as a quoted value, and the rates on this site are illustrative. */
const RAIL: BrandKey[] = [
  "steam",
  "itunes",
  "googleplay",
  "netflix",
  "playstation",
  "spotify",
  "ebay",
  "nike",
  "roblox",
  "target",
];

export function GiftcardMarquee() {
  return (
    <section id="giftcard-brands" aria-label="Gift card balances we convert" className="scroll-mt-24 pb-4">
      <Container>
        <p className="eyebrow mb-5 text-muted">Balances we convert</p>
      </Container>

      {/* `marquee-rail` is overflow-hidden while the animation runs and becomes
          horizontally scrollable under prefers-reduced-motion — see
          globals.css. Without that, someone with motion reduced sees the
          animation stop and can only ever reach the first two or three cards. */}
      <div className="marquee-rail no-scrollbar relative">
        {/* Fade the rail into the page rather than cutting it off. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24"
        />

        <ul className="animate-marquee flex w-max items-center gap-4">
          {RAIL.map((key) => (
            <li key={key} className="w-[150px] shrink-0 sm:w-[210px]">
              <GiftCardFace brandKey={key} />
            </li>
          ))}
          {/* The second pass exists only so translateX(-50%) loops seamlessly.
              It is hidden from assistive tech, which would otherwise read all
              twenty names, ten of them duplicates. */}
          {RAIL.map((key) => (
            <li
              key={`${key}-loop`}
              aria-hidden="true"
              className="w-[150px] shrink-0 sm:w-[210px]"
            >
              <GiftCardFace brandKey={key} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

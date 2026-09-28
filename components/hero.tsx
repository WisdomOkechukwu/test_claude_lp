import { Button, TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";
import { WhatYouGet } from "@/components/mockups/what-you-get";
import { InHandScreen } from "@/components/mockups/in-hand-screen";

/* What the business actually walks away with, stated as outcomes rather than
   features — the figures in a metrics dashboard belong to us, not to them. */
const OUTCOMES = [
  ["Get paid", "by link, bank transfer and NQR"],
  ["Keep more", "1% in capped at ₦2,000, 0.5% out capped at ₦1,000"],
  ["Recover more", "see what every borrower has paid and owes"],
] as const;

/* Where the phone's screen sits inside in-hand.jpg, measured off the file
   rather than eyeballed: the bright rectangle runs x 392-606, y 59-517 of
   1024x574. Because the shot is a flat lay the screen is axis-aligned, so no
   rotation or skew is needed — percentages alone keep the live UI registered
   at every viewport. Re-measure these if the photograph is ever replaced. */
const SCREEN = {
  left: "38.28%",
  top: "10.28%",
  width: "20.90%",
  height: "79.79%",
} as const;

export function Hero() {
  return (
    <section className="overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
      <Container className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          For Nigerian businesses
        </p>

        <h1 className="display mx-auto mt-7 max-w-[15ch] display-hero">
          Everything your business needs to move money
        </h1>

        <p className="mx-auto mt-7 max-w-[52ch] text-[17px] leading-relaxed text-muted">
          Collect from customers on every rail they already use, settle into
          your own bank the same day, and recover the loans you have given out —
          from one account, with one set of books.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
          <Button href="#how-it-works" size="lg">
            Open a business account
          </Button>
          <TextLink href="/developers">
            Read the API docs
          </TextLink>
        </div>

        <dl className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-3">
          {OUTCOMES.map(([title, body]) => (
            <div key={title}>
              <dt className="display text-xl">{title}</dt>
              <dd className="mx-auto mt-2 max-w-[24ch] text-[14px] leading-snug text-muted">
                {body}
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* The product, in someone's hands, with the real UI on the glass.

          The photograph is a white-desk flat lay, so it runs with no scrim and
          no ring: it bleeds into the white page instead of sitting in a card,
          which keeps the hero light. That also means the panel has to hold the
          photo's exact aspect ratio — object-cover at any other ratio would
          crop the frame and slide the screen out from under the overlay. */}
      <Container className="mt-16">
        <PhotoPanel
          src="/img/in-hand.jpg"
          sizes="(max-width: 1100px) 100vw, 1100px"
          scrim="none"
          ring={false}
          rounded="rounded-none"
          className="mx-auto aspect-[1024/574] w-full max-w-[1100px]"
        >
          <div className="absolute overflow-hidden rounded-[6%]" style={SCREEN}>
            <InHandScreen />
          </div>
        </PhotoPanel>
      </Container>

      {/* The panel sits below the centred statement, the way the reference
          layout drops its hero art under the headline. */}
      <Container className="mt-16">
        <div className="mx-auto max-w-[780px] text-left">
          <WhatYouGet />
        </div>
      </Container>
    </section>
  );
}

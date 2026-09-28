import { Button, TextLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";
import { GiftcardTrade } from "@/components/mockups/giftcard-trade";

export function Giftcards() {
  return (
    <section id="treasury" className="pb-18 sm:pb-24 lg:pb-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow className="text-brand">Treasury</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Accept gift cards, and sell the ones you hold
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg text-muted">
              Take a gift card as payment from a customer who has one and no
              naira, or sell down the store credit your own business has been
              paid in. Both run through the same desk: a rate quoted before you
              commit, locked the moment you confirm, and naira in your Tribe
              balance rather than a promise to settle later.
            </p>

            <dl className="mt-8 space-y-4">
              {[
                ["Accept", "A customer pays in Steam, iTunes or Google Play credit. You are credited in naira at the quoted rate; the card is our problem, not yours."],
                ["Sell", "Agencies and resellers get paid in store credit more often than anyone admits. Convert the balance at a rate you saw first."],
              ].map(([term, detail]) => (
                <div key={term} className="flex flex-wrap gap-x-3">
                  <dt className="shrink-0 font-semibold text-brand">{term}</dt>
                  <dd className="min-w-0 flex-1 basis-[22ch] text-[15px] leading-relaxed text-muted">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="#how-it-works" size="lg">
                Create an account to start
              </Button>
              <TextLink href="/developers/api#treasury">
                See how our treasury API works
              </TextLink>
            </div>
          </div>

          <div>
            <PhotoPanel
              src="/img/fabric.jpg"
              sizes="(max-width: 1024px) 90vw, 600px"
              className="flex justify-center px-6 py-12 sm:py-14"
            >
              <GiftcardTrade margin />
            </PhotoPanel>
          </div>
        </div>
      </Container>
    </section>
  );
}

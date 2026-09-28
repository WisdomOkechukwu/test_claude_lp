import { Button } from "@/components/ui/button";
import { GetAppButton } from "@/components/ui/get-app-button";
import { Container, Eyebrow } from "@/components/ui/section";
import { GiftcardTrade } from "@/components/mockups/giftcard-trade";

export function CustomerGiftcards() {
  return (
    <section id="giftcards" className="pb-18 sm:pb-24 lg:pb-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow className="text-brand">Giftcards</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Rates that don&apos;t insult you
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg text-muted">
              Sell the cards sitting in your inbox at a rate published before you
              commit and locked the moment you confirm. What you see quoted is
              what hits your balance — usually inside ten minutes.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <GetAppButton size="lg">Sell a giftcard</GetAppButton>
              <Button href="/customers#giftcard-brands" variant="secondary" size="lg">
                See the brands we convert
              </Button>
            </div>
          </div>

          <div className="flex justify-center rounded-2xl bg-bone px-6 py-12 sm:py-14">
            <GiftcardTrade />
          </div>
        </div>
      </Container>
    </section>
  );
}

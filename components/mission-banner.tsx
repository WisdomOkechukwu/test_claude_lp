import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { CoinTrail } from "@/components/art";

export function MissionBanner() {
  return (
    <section className="pb-18 sm:pb-24 lg:pb-28">
      <Container>
        {/* Padded top leaves room for the coin trail to break past the edge. */}
        <div className="relative pt-20 sm:pt-24">
          <CoinTrail className="pointer-events-none absolute left-1/2 top-0 h-auto w-[min(72%,460px)] -translate-x-1/2" />

          <div className="rounded-2xl bg-plum px-6 pb-16 pt-24 text-center sm:px-12 sm:pb-20 sm:pt-28">
            <h2 className="display mx-auto max-w-[22ch] display-section text-white">
              Nigerian business deserves Nigerian infrastructure
            </h2>
            <p className="mx-auto mt-6 max-w-[56ch] text-lg text-white/75">
              Money here moves on NIP and NQR, through banks and wallets
              that no foreign processor has ever had to think about. We built
              for those rails first, not as an afterthought.
            </p>
            <Button href="/about" variant="primary" size="lg" className="mt-9">
              How Tribe is built
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

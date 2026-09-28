import { Button, TextLink } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";
import { PaymentLinkBuilder } from "@/components/mockups/payment-link-builder";
import { Check } from "@/components/ui/icons";

const CHANNELS = [ "Bank transfer, matched to the customer who paid", "NQR codes any Nigerian bank app can scan", "A payment page you can send or print", "One API call, or no code at all",
];

export function PaymentLinks() {
  return (
    <Band id="collections" className="">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal">
            <Eyebrow>Collections</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Get paid on every rail your customer actually uses
            </h2>
            <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-muted">
              Three steps and you are collecting: set the amount, pick the
              rail, hand over the link. Customers pay by bank transfer or NQR,
              the money lands in your Tribe balance the moment it clears, and
              nobody has to pass an account number around on WhatsApp. Walk the
              steps to see exactly what your customer is handed.
            </p>

            <ul className="mt-8 space-y-2.5">
              {CHANNELS.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="#how-it-works" variant="primary" size="lg">
                Create an account to start
              </Button>
              <TextLink href="/developers/api#collections">
                See how our collections API works
              </TextLink>
            </div>
          </div>

          {/* Offset overlap: the builder breaks past the photograph's corner
              rather than sitting beside it in a matching column. Kwari Market
              in Kano is where a collection actually starts, so the product
              card reads as something laid over the trade, not next to it.

              The card keeps its own `ring-1 ring-line` and no shadow — depth
              here comes from the overlap, not from a drop shadow. */}
          <div className="reveal relative">
            <PhotoPanel
              src="/img/market-kano.jpg"
              sizes="(max-width: 640px) 380px, (max-width: 1024px) 92vw, 540px"
              className="mx-auto aspect-[4/5] w-full max-w-[380px] sm:max-w-none"
            />
            {/* The card breaks past the photograph's edge instead of sitting
                beside it in a matching column — depth from the overlap, not
                from a drop shadow, which the brand rules rule out. Below sm
                the two stack and the card is simply pulled up, because at
                375px an overlap would bury the photo entirely. */}
            <div className="relative z-10 mx-auto -mt-16 w-full max-w-[330px] sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:w-[64%] sm:max-w-[330px] lg:-left-10">
              <PaymentLinkBuilder />
            </div>
          </div>
        </div>
      </Container>
    </Band>
  );
}

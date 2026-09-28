import { GetAppButton } from "@/components/ui/get-app-button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";
import { TransferForm } from "@/components/mockups/transfer-form";
import { Bank, Clock, ShieldCheck } from "@/components/ui/icons";

const POINTS = [
  {
    icon: Clock,
    title: "Seconds, not working days",
    body: "Transfers ride NIP, so they land at 2am on a Sunday the same as they do on a Tuesday morning.",
  },
  {
    icon: Bank,
    title: "Every bank and wallet",
    body: "GTBank, Zenith, Access, UBA, First Bank, Kuda, Moniepoint, Opay, PalmPay — if it takes naira, you can send to it.",
  },
  {
    icon: ShieldCheck,
    title: "The name before the money",
    body: "We resolve the account holder's name before you confirm, so a mistyped digit never costs you.",
  },
];

export function CustomerTransfers() {
  return (
    <Band id="transfers" className="">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal">
            <Eyebrow>Send money</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Send to any Nigerian bank for free
            </h2>
            <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-muted">
              No daily cap you only discover at the till, no ₦52.50 shaved off
              every transfer, no waiting for a bank to open. Type the amount,
              check the name, send.
            </p>
            {/* Icon inside the dt — see loan-collection.tsx for why. */}

            <dl className="mt-10 space-y-6">
              {POINTS.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <dt className="flex items-center gap-4 font-semibold">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    {title}
                  </dt>
                  <dd className="mt-1 max-w-[44ch] pl-[60px] text-[15px] leading-relaxed text-muted">
                    {body}
                  </dd>
                </div>
              ))}
            </dl>

            <GetAppButton variant="primary" size="lg" className="mt-10">
              Create a free account
            </GetAppButton>
          </div>

          {/* Same offset overlap as the business collections section, mirrored:
              the person holding the phone is the context, the send form is the
              thing laid over it. */}
          <div className="reveal relative">
            <PhotoPanel
              src="/img/sender.jpg"
              sizes="(max-width: 640px) 380px, (max-width: 1024px) 92vw, 540px"
              className="mx-auto aspect-[4/5] w-full max-w-[380px] sm:max-w-none"
            />
            {/* The card breaks past the photograph's edge instead of sitting
                beside it in a matching column — depth from the overlap, not
                from a drop shadow, which the brand rules rule out. Below sm
                the two stack and the card is simply pulled up, because at
                375px an overlap would bury the photo entirely. */}
            <div className="relative z-10 mx-auto -mt-16 w-full max-w-[330px] sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:w-[64%] sm:max-w-[330px] lg:-left-10">
              <TransferForm />
            </div>
          </div>
        </div>
      </Container>
    </Band>
  );
}

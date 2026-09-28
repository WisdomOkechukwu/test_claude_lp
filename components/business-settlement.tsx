import { Button, TextLink } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { SettlementConsole } from "@/components/mockups/settlement-console";
import { Bank, Clock, Receipt, Split } from "@/components/ui/icons";

const POINTS = [
  {
    icon: Clock,
    title: "Same day, or the next",
    body: "T+1 as standard, instant over NIP when you need the cash today.",
  },
  {
    icon: Split,
    title: "Split across vaults",
    body: "A named balance per branch, vendor or product line — each on its own schedule, each settling to its own account.",
  },
  {
    icon: Bank,
    title: "Any Nigerian bank",
    body: "GTBank, Zenith, Access, UBA, Kuda, Moniepoint, Opay — all 20+ of them.",
  },
  {
    icon: Receipt,
    title: "Reconciles itself",
    body: "Every payout carries a reference that matches what the bank credited.",
  },
];

export function BusinessSettlement() {
  return (
    <Band id="settlement" className="">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal">
            <Eyebrow>Business settlement</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Your money, in your bank, on a schedule you set
            </h2>
            <p className="mt-6 max-w-[48ch] text-[17px] leading-relaxed text-muted">
              Collections land in a Tribe balance and settle out to your own
              account on NIBSS rails. Choose instant, next working day or
              weekly. Every payout arrives with a reference your accountant can
              match line for line.
            </p>

            <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {POINTS.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <dt className="flex items-center gap-2.5 font-semibold">
                    <Icon className="h-5 w-5 shrink-0 text-brand" />
                    {title}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-muted">
                    {body}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="#how-it-works" variant="primary" size="lg">
                Create an account to start
              </Button>
              <TextLink href="/developers/api#settlement">
                See how our settlement API works
              </TextLink>
            </div>
          </div>

          <div className="reveal flex justify-center lg:order-first lg:justify-start">
            <SettlementConsole />
          </div>
        </div>
      </Container>
    </Band>
  );
}

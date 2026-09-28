import { Button, TextLink } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { LoanProfile } from "@/components/mockups/loan-profile";
import { Clock, Repeat, TrendUp } from "@/components/ui/icons";

const PILLARS = [
  {
    icon: TrendUp,
    title: "A position per borrower",
    body: "Open anyone on your book and see it at once: paid to date, still outstanding, instalments left, and when the next one falls due.",
  },
  {
    icon: Repeat,
    title: "Repayments from anywhere",
    body: "Money that comes in through Tribe attaches itself to the loan. Cash, a bank transfer you took elsewhere, a part payment — record it in one call and the position moves with it.",
  },
  {
    icon: Clock,
    title: "Arrears the morning it happens",
    body: "A missed instalment fires a webhook the day the date passes, not at the end of the month when the spreadsheet is reconciled.",
  },
];

export function LoanCollection() {
  return (
    <Band id="loans">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <LoanProfile />
          </div>

          <div className="order-1 lg:order-2">
            <Eyebrow className="text-brand">Loan collection</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Lending is the easy half. Knowing where it stands is the business.
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg text-muted">
              Tribe does not debit your borrowers — that relationship is yours,
              and it should stay yours. What Tribe keeps is the book: every
              loan, every repayment against it, and a running position you can
              read in one call instead of reconstructing from a spreadsheet at
              month end.
            </p>

            {/* The icon lives inside the <dt>. A div inside a dl may only hold
                dt/dd groups, so an icon span sitting beside the wrapper made
                the whole list invalid — and that single mistake was also the
                entire Lighthouse agentic-browsing failure. The dd indent keeps
                the body aligned under the title: 44px icon + 16px gap. */}

            <dl className="mt-10 space-y-6">
              {PILLARS.map(({ icon: Icon, title, body }) => (
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

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="#how-it-works" size="lg">
                Create an account to start
              </Button>
              <TextLink href="/developers/api#loans">
                See how our loan API works
              </TextLink>
            </div>
          </div>
        </div>
      </Container>
    </Band>
  );
}

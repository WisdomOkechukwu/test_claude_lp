import { Band, Container, Eyebrow } from "@/components/ui/section";
import { TextLink } from "@/components/ui/button";
import { CoverageTabs } from "@/components/coverage-tabs";
import { Check } from "@/components/ui/icons";

/* The section promised "what it costs" and for a long time showed nothing, then
   showed a four-row definition list that read like small print.

   The price is the argument, so it leads: two figures set at display size on a
   hairline card, the two zeroes beneath them as a footnote rather than as rows
   of equal weight. Everything Tribe does then sits underneath in the tabs,
   because "what it costs" only means something once you know what "it" is. */
const PRICES = [
  {
    label: "Money in",
    figure: "1%",
    cap: "capped at ₦2,000",
    detail: "Payment link, bank transfer or NQR. Above ₦200,000 the percentage stops and the fee is flat.",
  },
  {
    label: "Settlement out",
    figure: "0.5%",
    cap: "capped at ₦1,000",
    detail: "Instant on NIP, next working day or weekly — the cadence does not change the price.",
  },
];

const FREE = [
  "User-to-user transfers by cashpoint, any amount, any hour",
  "Setup, onboarding and your first API keys",
  "Monthly fees, minimum volumes and dormancy charges",
  "Every read on the API, including the loan book",
];

export function Coverage() {
  return (
    <Band id="coverage" className="bg-bone">
      <Container>
        <div className="max-w-[48ch]">
          <Eyebrow className="text-brand">Pricing</Eyebrow>
          <h2 className="heading display-section">
            Two numbers, both capped
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            The cap is the part that matters. Most Nigerian processors publish a
            percentage and cap it somewhere you will never reach; ours stops at
            ₦200,000 on the way in and ₦200,000 on the way out, which is where a
            real invoice actually lands.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {PRICES.map(({ label, figure, cap, detail }) => (
            <div
              key={label}
              className="flex flex-col rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8"
            >
              <p className="eyebrow text-muted">{label}</p>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
                <span className="display tnum text-[3rem] leading-none text-brand">
                  {figure}
                </span>
                <span className="text-[15px] font-semibold">{cap}</span>
              </p>
              <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-muted">
                {detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8">
          <h3 className="text-[15px] font-bold">And nothing at all for</h3>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {FREE.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-muted">
          Illustrative pricing for a demonstration product.
          <TextLink href="/developers/api">See what each call costs</TextLink>
        </p>

        <div className="mt-16 border-t border-line pt-14">
          <h2 className="heading max-w-[22ch] display-section">
            Everything Tribe does
          </h2>
          <CoverageTabs />
        </div>
      </Container>
    </Band>
  );
}

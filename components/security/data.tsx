import { Band, Container, Eyebrow } from "@/components/ui/section";
import { Check, Close, ShieldCheck } from "@/components/ui/icons";

/* The strongest line on this page is a negative one, and it is only true
   because Tribe does not accept cards. Nothing to store means nothing to leak
   — worth saying plainly rather than burying in a list. */
const HELD = [
  "Your business details, and the identity documents behind them",
  "Names, phone numbers and BVN or NIN check results for the users you create",
  "Every deposit, withdrawal, transfer, repayment and bulk run, with its rail reference",
  "Sign-in events, approvals and key usage, as the audit trail",
];

const NOT_HELD = [
  "Card numbers, expiry dates and security codes — Tribe does not accept cards, so there is nothing to store",
  "Your customers' bank passwords or one-time codes; the transfer happens in their own bank app",
  "Full BVN or NIN values after a check has run — the result is kept, the number is not",
  "Anything at all once you ask for it to be deleted and no legal hold applies",
];

const HANDLING = [
  {
    title: "Encrypted in transit and at rest",
    body: "TLS on every connection, including between our own services. Stored data is encrypted with keys we can rotate without touching the data itself.",
  },
  {
    title: "Fraud monitoring, not fraud theatre",
    body: "Velocity, pattern and destination checks run on every movement. What they flag goes to a person, and a held payout is told to you rather than silently dropped.",
  },
  {
    title: "Retention with an end date",
    body: "Transaction records are kept for as long as a business needs them for its own books. Everything else has a shorter life, and deletion on request is a real request.",
  },
];

export function SecurityData() {
  return (
    <Band id="data" className="bg-bone">
      <Container>
        <div className="max-w-[52ch]">
          <Eyebrow className="text-brand">Data</Eyebrow>
          <h2 className="heading display-section">
            The safest record is the one that was never kept
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            Tribe never holds card data, because Tribe never accepts a card.
            That removes the single largest category of payments data a business
            can lose — and it is worth being specific about what is left.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8">
            <h3 className="heading text-xl">What is held</h3>
            <ul className="mt-6 space-y-3">
              {HELD.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8">
            <h3 className="heading text-xl">What is not</h3>
            <ul className="mt-6 space-y-3">
              {NOT_HELD.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed">
                  <Close className="mt-1 h-4 w-4 shrink-0 text-accent-ink" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl id="fraud" className="mt-12 grid gap-8 scroll-mt-24 sm:grid-cols-3">
          {HANDLING.map(({ title, body }) => (
            <div key={title}>
              <dt className="flex items-center gap-3 font-semibold">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand" />
                {title}
              </dt>
              <dd className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-muted">
                {body}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Band>
  );
}

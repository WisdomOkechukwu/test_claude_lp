import { Container } from "@/components/ui/section";
import { SectionHead } from "@/components/ui/section";

export type Quote = {
  quote: string;
  name: string;
  cta: string;
};

const BUSINESS_QUOTES: Quote[] = [
  {
    quote:
      "We stopped sending account numbers to clients. One link, they pay, settlement hits GTBank the next morning. Chasing payments went from a full day a week to almost nothing.",
    name: "Ada, agency founder · Port Harcourt",
    cta: "Agency, 12 staff",
  },
  {
    quote:
      "I can open any borrower and see what they have paid and what is left, without asking anyone or opening a spreadsheet. The arrears alert reaches me the morning it happens, not at the end of the month.",
    name: "Emeka, microlender · Abuja",
    cta: "Lender, ₦400m book",
  },
  {
    quote:
      "I had the sandbox working before lunch and we were live on collections that week. The webhook signatures are sane, which is more than I can say for the last three we tried.",
    name: "Zainab, CTO · fintech",
    cta: "Fintech, Series A",
  },
];

/* A quiet grid of hairline cards. This used to be a horizontally scrolling
   rail of saturated purple and orange blocks, which was the loudest thing on
   the page and repeated the two-column rhythm yet again. */
export function Testimonials({
  heading = "The businesses already running on Tribe",
  quotes = BUSINESS_QUOTES,
}: {
  heading?: string;
  quotes?: Quote[];
}) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHead eyebrow="Customers" title={heading} />

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {quotes.slice(0, 3).map((q) => (
            <li
              key={q.name}
              className="flex h-full flex-col rounded-xl border border-line p-6"
            >
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none text-brand/30"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-ink">
                  {q.quote}
                </blockquote>
                <footer className="mt-6 border-t border-line pt-4">
                  <p className="text-[14px] font-semibold">{q.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted">{q.cta}</p>
                </footer>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/section";
import { TextLink } from "@/components/ui/button";

/* This replaces a trust bar and a stats band that both stated things nobody
   could check — ₦48b settled, 12,400 businesses, a 93% recovery rate, funds
   "held separately with partner banks". Invented figures on a demo product are
   worse than no figures, so what stands here instead is the mechanism: the
   three calls a business actually makes, in order.

   It is the same sequence as the quickstart on /developers, deliberately. An
   operations lead and an engineer should be reading the same product. */
const STEPS = [
  {
    n: "01",
    title: "Create a user",
    body: "Name, phone, BVN where you need one. A customer paying you, a vendor you pay and a borrower you are collecting from are all the same record — which is why you can read one person's whole position later.",
    cta: "Users API",
    href: "/developers/api#users",
  },
  {
    n: "02",
    title: "Take a deposit",
    body: "A payment link, a bank transfer or an NQR code on the counter. However it arrives it lands in your Tribe balance as one kind of object, so there is one thing to reconcile rather than three.",
    cta: "Deposits API",
    href: "/developers/api#collections",
  },
  {
    n: "03",
    title: "Withdraw to your bank",
    body: "Out on NIBSS Instant Payment in about ninety seconds, or on the schedule you set — next working day, or weekly. Every payout carries a reference that matches the line on your statement.",
    cta: "Withdrawals API",
    href: "/developers/api#settlement",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <Container>
        <div className="border-y border-line py-12">
          <h2 className="heading max-w-[26ch] text-2xl">
            Three calls, and the money is in your bank
          </h2>
          <ol className="reveal mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
            {STEPS.map(({ n, title, body, cta, href }) => (
              <li key={n} className="min-w-0">
                <p className="display tnum text-[2rem] text-brand">{n}</p>
                <h3 className="heading mt-1 text-xl">{title}</h3>
                <p className="mt-2.5 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                  {body}
                </p>
                <TextLink href={href} className="mt-3">
                  {cta}
                </TextLink>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

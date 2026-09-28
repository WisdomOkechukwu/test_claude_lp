import { Button, TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Fingerprint, Receipt, ShieldCheck } from "@/components/ui/icons";
import { Padlock } from "@/components/art";

/* The teaser for /security. It used to end in a row of badges reading "NDPR
   compliant · ISO 27001 · SOC 2 Type II · Independently pen-tested". Two of
   those are certifications and one is a compliance claim, which CLAUDE.md
   forbids outright — security copy here describes practices, not
   accreditations. The row is gone and what replaced it is three links to
   places that actually explain something. */
const PILLARS = [
  {
    icon: ShieldCheck,
    text: "A review queue in Port Harcourt looks at what the rules flag, tuned on Nigerian fraud patterns rather than someone else's",
  },
  {
    icon: Fingerprint,
    text: "BVN and NIN matched before a payout leaves or a borrower is booked, with two-factor sign-in on every device",
  },
  {
    icon: Receipt,
    text: "Approval limits, roles and an audit trail on every movement — who raised it, who approved it, and when it left",
  },
] as const;

export function SecuritySection() {
  return (
    <section id="security" className="pb-18 sm:pb-24 lg:pb-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="heading display-section">
              Disappoint fraudsters
            </h2>
            <p className="mt-6 max-w-[46ch] text-lg text-muted">
              Money only ever goes where you sent it, and there is a record
              afterwards that says so. Here is how that is arranged — written
              as practices, because a badge is not an argument.
            </p>
            <Button href="/security" size="lg" className="mt-9">
              Read the security overview
            </Button>
          </div>
          <Padlock className="mx-auto h-auto w-[min(72%,340px)]" />
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {PILLARS.map(({ icon: Icon, text }) => (
            <div key={text}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-5 max-w-[32ch] text-[15px] font-semibold leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8">
          <TextLink href="/security#data">What we store, and what we never hold</TextLink>
          <TextLink href="/developers#security">Security notes for engineers</TextLink>
          <TextLink href="/security#disclosure">Report a vulnerability</TextLink>
        </div>
      </Container>
    </section>
  );
}

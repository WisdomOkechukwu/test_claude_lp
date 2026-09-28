import { Container, Eyebrow } from "@/components/ui/section";
import { Button, TextLink } from "@/components/ui/button";
import { Check } from "@/components/ui/icons";

const IN_SCOPE = [
  "Anything on tribe.ng and its subdomains",
  "The REST API at api.tribe.ng, in either environment",
  "The webhook signing scheme and the SDKs that implement it",
  "The dashboard, including role and approval-limit enforcement",
];

const OUT_OF_SCOPE = [
  "Findings from automated scanners with no demonstrated impact",
  "Volumetric or denial-of-service testing of any kind",
  "Social engineering of staff, customers or partners",
  "Anything requiring access to a device or account you do not own",
];

const EXPECT = [
  ["We acknowledge", "within two working days, to a person, not an autoresponder"],
  ["We triage", "within ten, and tell you the severity we assigned and why"],
  ["We fix", "and tell you when it shipped, rather than closing the thread quietly"],
  ["We credit you", "publicly if you want it, and never without asking first"],
] as const;

export function SecurityDisclosure() {
  return (
    <section id="disclosure" className="scroll-mt-24 pb-18 sm:pb-24 lg:pb-28">
      <Container>
        <div className="max-w-[52ch]">
          <Eyebrow className="text-brand">Responsible disclosure</Eyebrow>
          <h2 className="heading display-section">
            Found something? Tell us before you tell anyone else
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            Research done in good faith against the scope below is welcome, and
            we will not pursue anyone who stays inside it. Use the sandbox and
            your own accounts — never another business&apos;s data, and never
            more of it than you need to prove the point.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <h3 className="heading text-xl">In scope</h3>
            <ul className="mt-5 space-y-2.5">
              {IN_SCOPE.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="heading text-xl">Out of scope</h3>
            <ul className="mt-5 space-y-2.5 text-muted">
              {OUT_OF_SCOPE.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-relaxed">
                  <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-line" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-2xl bg-plum px-7 py-10 text-white sm:px-10">
          <h3 className="heading max-w-[24ch] text-2xl">What happens after you send it</h3>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EXPECT.map(([term, detail]) => (
              <div key={term}>
                <dt className="font-semibold text-accent">{term}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-white/75">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[64ch] text-[15px] leading-relaxed text-white/75">
            Tribe is a demonstration brand built for this website. It holds no
            funds, is not a licensed financial service, and claims no
            certification, audit or accreditation of any kind — including the
            ones this page deliberately does not name. There is no live
            disclosure inbox behind this section.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button href="/developers#security" variant="onDark" size="lg">
              Security notes for engineers
            </Button>
            <TextLink href="/developers/api#errors" tone="onDark">
              Error codes
            </TextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

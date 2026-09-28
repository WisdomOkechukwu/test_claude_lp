import { Button } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import {
  Bank,
  Clock,
  Code,
  Receipt,
  ShieldCheck,
  Users,
} from "@/components/ui/icons";

const VALUES = [
  { icon: Clock, title: "Say when", body: "Every screen that moves money tells you when it lands. \"Processing\" is not an answer, and we treat it as a bug." },
  { icon: Receipt, title: "Show the number", body: "Fees are on the screen before you confirm, not in a statement three weeks later. If we cannot explain a fee in one line, we do not charge it." },
  { icon: ShieldCheck, title: "Boring where it counts", body: "Settlement, reconciliation and recovery should be dull and predictable. We save the invention for the parts that are safe to get wrong." },
  { icon: Code, title: "Built to be built on", body: "Everything the dashboard does, the API does. No feature ships to one and not the other." },
];

const TEAM = [
  { icon: Users, figure: "60+", label: "people, most of them in Port Harcourt" },
  { icon: Bank, figure: "4", label: "partner banks we settle through" },
  { icon: Code, figure: "1", label: "API behind every product" },
];

export function AboutValues() {
  return (
    <>
      <Band id="values">
        <Container>
          <div className="max-w-[46ch]">
            <Eyebrow className="text-brand">What we hold to</Eyebrow>
            <h2 className="heading display-section">
              Four things we argue about internally
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="lift h-full rounded-2xl border border-line p-7 hover:border-brand/40 hover:ring-1 ring-line"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {body}
                  </p>
                </div>
            ))}
          </div>
        </Container>
      </Band>

      <section id="careers" className="pb-18 sm:pb-24 lg:pb-28">
        <Container>
          <div className="rounded-2xl bg-plum px-7 py-14 text-white sm:px-12 sm:py-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="display max-w-[22ch] display-section">
                  We are hiring people who have felt the problem
                </h2>
                <p className="mt-6 max-w-[48ch] text-lg text-white/75">
                  Engineers, risk analysts and support people — mostly in Port Harcourt,
                  some remote across Nigeria. If you have ever waited on a
                  settlement that should have landed, you already understand the
                  job.
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Button href="/careers" variant="primary" size="lg">
                    See open roles
                  </Button>
                  <Button href="/careers#process" variant="onDark" size="lg">
                    How we hire
                  </Button>
                </div>
              </div>
              {/* Icon inside the dt — see loan-collection.tsx for why. 48px
                  chip plus a 16px gap indents the label by 64px. */}

              <dl className="grid gap-8 self-center sm:grid-cols-3 lg:grid-cols-1">
                {TEAM.map(({ icon: Icon, figure, label }) => (
                  <div key={label}>
                    <dt className="display tnum flex items-center gap-4 text-2xl">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-accent">
                        <Icon className="h-6 w-6" />
                      </span>
                      {figure}
                    </dt>
                    <dd className="mt-0.5 pl-16 text-[14px] text-white/70">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

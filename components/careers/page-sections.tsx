import { Band, Container, Eyebrow, SectionHead } from "@/components/ui/section";
import { Button, TextLink } from "@/components/ui/button";
import { PhotoPanel } from "@/components/ui/photo";
import {
  Bank,
  Check,
  Clock,
  Code,
  Globe,
  Receipt,
  ShieldCheck,
  Users,
} from "@/components/ui/icons";

/* Photography here is the same CC0 set the rest of the site draws on —
   `public/img/CREDITS.md` records every file and every rejection, and notes
   that the usable pool is close to exhausted. `workspace.jpg` and
   `operator-phone.jpg` are the two frames that read as work without carrying a
   third-party logo or a face attached to a claim.

   No invented headcount figures and no employee photographs with invented
   quotes beside them: CC0 covers copyright, not likeness. */

const WHY = [
  {
    icon: Clock,
    title: "You will ship in your first week",
    body: "Small teams, short review queues and a deploy pipeline that runs in minutes. Nothing here waits a quarter for a release train.",
  },
  {
    icon: ShieldCheck,
    title: "The failure cases are the job",
    body: "Anyone can write the happy path. We hire people who reach for the dormant account, the duplicate reference and the payout that came back.",
  },
  {
    icon: Globe,
    title: "Built here, for here",
    body: "NIP, NQR and the way a Nigerian business actually gets paid. Not a foreign product with a naira column bolted on.",
  },
  {
    icon: Users,
    title: "Port Harcourt first, remote welcome",
    body: "The office is in Port Harcourt and most of the team is in it. Remote across Nigeria is normal, not an exception you have to argue for.",
  },
];

const ROLES = [
  {
    team: "Engineering",
    icon: Code,
    open: [
      ["Senior Backend Engineer", "Go or Node · Port Harcourt or remote", "Own a slice of the money path — deposits, withdrawals or the loan ledger. You will be on call for what you build."],
      ["Frontend Engineer", "TypeScript, React · Port Harcourt", "The dashboard and the payment pages. Strong opinions about forms, states and what a screen should say while it is waiting."],
      ["Mobile Engineer", "React Native · Port Harcourt or remote", "The customer app: transfers, cashpoints, bills and gift cards, on phones that are two Android versions behind."],
      ["Platform Engineer", "Port Harcourt or remote", "Deploys, observability and the sandbox that has to fail the way production fails."],
    ],
  },
  {
    team: "Risk and operations",
    icon: ShieldCheck,
    open: [
      ["Fraud Analyst", "Port Harcourt", "Tune the rules on Nigerian patterns and work the review queue. You will see every new scam before the rest of us do."],
      ["Settlement Operations", "Port Harcourt", "Reconciliation, returned payouts and the bank relationships behind them."],
    ],
  },
  {
    team: "Commercial and support",
    icon: Receipt,
    open: [
      ["Solutions Engineer", "Port Harcourt or Lagos", "Sit with a lender or a marketplace through their first integration. Half engineering, half listening."],
      ["Support Lead", "Port Harcourt", "Own the queue and the tone of it. English, Pidgin and at least one of Igbo, Hausa or Yoruba."],
    ],
  },
];

const PROCESS = [
  ["A conversation", "Thirty minutes with someone who does the job you applied for. No take-home yet, no panel."],
  ["A practical", "A real problem from our own backlog, timeboxed to three hours and paid for. You keep the work."],
  ["Meet the team", "Two conversations: one technical, one about how you work with people. Both ways — ask us anything."],
  ["An answer", "Within five working days of the last conversation, either way, with a reason."],
];

export function CareersHero() {
  return (
    <section className="overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20">
      <Container className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Careers at Tribe
        </p>

        <h1 className="display mx-auto mt-7 max-w-[15ch] display-hero">
          Come and build the rails you already use
        </h1>

        <p className="mx-auto mt-7 max-w-[56ch] text-[17px] leading-relaxed text-muted">
          We are in Port Harcourt, building collections, settlement and loan
          tracking for Nigerian businesses. If you have ever waited on a payout
          that should have landed, or explained to a customer why their transfer
          is &ldquo;processing&rdquo;, you already understand the job.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
          <Button href="#roles" size="lg">
            See open roles
          </Button>
          <TextLink href="#process">How we hire</TextLink>
        </div>
      </Container>

      <Container className="mt-14">
        <PhotoPanel
          src="/img/operator-phone.jpg"
          sizes="(max-width: 1100px) 100vw, 1100px"
          scrim="deep"
          className="mx-auto flex aspect-[16/7] w-full max-w-[1100px] items-end px-6 py-8 sm:px-10 sm:py-10"
          imageClassName="object-center"
        >
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/85 sm:text-[17px]">
            Most of the team is in one room in Port Harcourt, which is why a
            question about settlement gets answered in a minute rather than a
            sprint.
          </p>
        </PhotoPanel>
      </Container>
    </section>
  );
}

export function CareersWhy() {
  return (
    <Band id="why" className="bg-bone">
      <Container>
        <SectionHead
          eyebrow="Working here"
          title="What the job is actually like"
          body="No ping-pong table in the copy. Here is what is true about the work."
        />

        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {WHY.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <dt className="flex items-center gap-4 font-semibold">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                {title}
              </dt>
              <dd className="mt-1 max-w-[48ch] pl-[60px] text-[15px] leading-relaxed text-muted">
                {body}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Band>
  );
}

export function CareersRoles() {
  const count = ROLES.reduce((n, r) => n + r.open.length, 0);

  return (
    <Band id="roles">
      <Container>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div className="max-w-[46ch]">
            <Eyebrow className="text-brand">Open roles</Eyebrow>
            <h2 className="heading display-section">{count} roles open</h2>
          </div>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-muted sm:ml-auto">
            Nothing here is a wish list. Every one of these has a team waiting
            and a budget signed off.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {ROLES.map(({ team, icon: Icon, open }) => (
            <section key={team}>
              <h3 className="flex items-center gap-3 text-[15px] font-bold">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {team}
              </h3>

              <ul className="mt-5 divide-y divide-line border-y border-line">
                {open.map(([title, where, body]) => (
                  <li key={title} className="py-5">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h4 className="text-[16px] font-bold">{title}</h4>
                      <p className="text-[13px] text-muted">{where}</p>
                      <div className="ml-auto">
                        <TextLink href="#apply">Apply</TextLink>
                      </div>
                    </div>
                    <p className="mt-1.5 max-w-[68ch] text-[15px] leading-relaxed text-muted">
                      {body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-10 max-w-[60ch] text-[15px] leading-relaxed text-muted">
          Nothing that fits?{" "}
          <TextLink href="#apply">Tell us what you would build</TextLink>
        </p>
      </Container>
    </Band>
  );
}

export function CareersProcess() {
  return (
    <Band id="process" className="bg-bone">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-20">
          <div>
            <SectionHead
              eyebrow="How we hire"
              title="Four steps, and we pay for the hard one"
              body="No unpaid take-homes, no six-round gauntlet, no puzzle about manhole covers."
            />

            <ol className="mt-10 space-y-6">
              {PROCESS.map(([title, body], i) => (
                <li key={title} className="flex gap-5">
                  {/* Fixed width, not just tabular figures: the numbers are the
                      left rule of the list, and without it each title started at
                      a slightly different x. */}
                  <span className="display tnum w-[2.4ch] shrink-0 text-[1.75rem] leading-none text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-1 block max-w-[52ch] text-[15px] leading-relaxed text-muted">
                      {body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:pt-10">
            <PhotoPanel
              src="/img/workspace.jpg"
              sizes="(max-width: 1024px) 90vw, 460px"
              scrim="base"
              className="flex aspect-[4/5] items-end p-7"
            >
              <p className="text-[15px] leading-relaxed text-white/85">
                The practical is a real problem from our own backlog. If we
                cannot describe it in a paragraph, it is not a fair test.
              </p>
            </PhotoPanel>
          </div>
        </div>
      </Container>
    </Band>
  );
}

export function CareersApply() {
  return (
    <section id="apply" className="scroll-mt-24 pb-18 sm:pb-24 lg:pb-28">
      <Container>
        <div className="rounded-2xl bg-plum px-7 py-14 text-white sm:px-12 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="display max-w-[22ch] display-section">
                Send us something you have built
              </h2>
              <p className="mt-6 max-w-[48ch] text-lg text-white/75">
                A CV is fine. A repository, a write-up of something that broke
                and how you fixed it, or a queue you once untangled is better.
                Tell us which role and what you would want to own in it.
              </p>

              <ul className="mt-8 space-y-2.5">
                {[
                  "Every application gets a human answer",
                  "Five working days from the last conversation",
                  "Salary range shared before the first call, not after the fourth",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-white/75"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Button href="#roles" variant="onDark" size="lg">
                  Pick a role
                </Button>
                <TextLink href="/about" tone="onDark">
                  What Tribe is building
                </TextLink>
              </div>
            </div>

            <dl className="grid gap-8 self-center sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Users, figure: "60+", label: "people, most of them in Port Harcourt" },
                { icon: Bank, figure: "4", label: "partner banks we settle through" },
                { icon: Code, figure: "1", label: "API behind every product" },
              ].map(({ icon: Icon, figure, label }) => (
                <div key={label}>
                  <dt className="display tnum flex items-center gap-4 text-2xl">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-accent">
                      <Icon className="h-6 w-6" />
                    </span>
                    {figure}
                  </dt>
                  <dd className="mt-2 max-w-[24ch] pl-16 text-[15px] leading-relaxed text-white/75">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}

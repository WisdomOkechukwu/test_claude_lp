import Link from "next/link";
import { Button, TextLink } from "@/components/ui/button";
import { Band, Container, Eyebrow, SectionHead } from "@/components/ui/section";
import { CodeBlock } from "@/components/developers/code-block";
import { SdkFlow } from "@/components/developers/sdk-flow";
import { DocsSearch } from "@/components/developers/docs-search";
import {
  BASE_URL,
  QUICKSTART,
  WEBHOOK_EVENTS,
} from "@/components/developers/api-data";
import { Check, Code, Lock, Repeat, ShieldCheck } from "@/components/ui/icons";

/* Four calls to go live — the same promise built-for-both.tsx makes on the home
   page, made good here. Keep these in step if either changes.

   The samples come from api-data.ts rather than being retyped. They used to be
   hand-copied, and the two pages drifted apart exactly the way that module's
   header comment says they must not. */
const STEPS = [
  {
    n: "01",
    title: "Take your keys from the dashboard",
    body: "Two pairs, test and live. The test pair talks to a sandbox that behaves like the real rails, including the failures — a dormant account, a rejected transfer, a returned payout.",
    blocks: [
      {
        label: ".env",
        code: `TRIBE_SECRET_KEY=sk_test_4c81d9
TRIBE_PUBLIC_KEY=pk_test_4c81d9`,
      },
    ],
  },
  {
    n: "02",
    title: "Create the user money will move to or from",
    body: "A customer paying you, a vendor you pay, a borrower you are collecting from — all the same object. Everything after this hangs off the id it returns, which is what lets you read one person's whole position later.",
    blocks: [
      { label: `POST ${BASE_URL}/users`, code: QUICKSTART.users },
    ],
  },
  {
    n: "03",
    title: "Take a deposit, or send a withdrawal",
    body: "Money in and money out are the same two calls for every product on Tribe. A deposit comes back with somewhere to send the payer; a withdrawal goes straight onto NIP and comes back with the reference your bank statement will carry.",
    blocks: [
      { label: `POST ${BASE_URL}/deposits`, code: QUICKSTART.deposits },
      { label: `POST ${BASE_URL}/withdrawals`, code: QUICKSTART.withdrawals },
    ],
  },
  {
    n: "04",
    title: "Verify the webhook",
    body: "Never trust the redirect back to your site — a customer can close the tab, and a browser can lie. The webhook is the source of truth. Check the signature before you read the body.",
    blocks: [
      {
        label: "verify.ts",
        code: `import { createHmac, timingSafeEqual } from "node:crypto";

export function verify(raw: string, signature: string) {
  const expected = createHmac("sha512", process.env.TRIBE_SECRET_KEY!)
    .update(raw)
    .digest("hex");

  return timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature),
  );
}`,
      },
    ],
  },
] as const;

const GO_LIVE = [
  "Swap the test key for the live one. Nothing else changes — same paths, same payloads.",
  "Point your webhook at a public HTTPS URL and verify the signature on every delivery.",
  "Send a reference on every write call so a retry can never take the same deposit twice.",
  "Handle loan.in_arrears. On a real book it fires more often than loan.repayment_recorded in the first month.",
  "Reconcile against withdrawal.paid, not deposit.succeeded — money in your balance is not money in your bank.",
];

/* Practices, not accreditations — CLAUDE.md rules out naming a regulator or
   claiming a certification, and /security holds the long form of this. */
const SECURITY = [
  {
    icon: Lock,
    title: "Rotate a key without downtime",
    body: "Issue the replacement, run both for as long as you need, then revoke the old one. Nothing has to be redeployed in between.",
  },
  {
    icon: ShieldCheck,
    title: "Verify against the raw bytes",
    body: "HMAC-SHA512 over the body as it arrived, compared in constant time. Not the parsed object — your framework may have reordered it.",
  },
  {
    icon: Repeat,
    title: "Assume replays",
    body: "Deliveries arrive more than once and out of order. Key your handler on the event id and make applying it twice a no-op.",
  },
  {
    icon: Code,
    title: "Allowlist where it matters",
    body: "Pin a live secret key to the addresses your servers actually call from, so a leaked key is useless off your own network.",
  },
];

export function DeveloperJourney() {
  return (
    <>
      <section className="overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20">
        <Container>
          <Eyebrow className="text-brand">Developers</Eyebrow>
          <h1 className="display max-w-[15ch] display-hero">
            Four calls to go live
          </h1>
          <p className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-muted">
            One REST API over Nigerian rails. Users, deposits by link, bank
            transfer and NQR, withdrawals on NIP, instant transfers between
            your users, loan tracking and bulk disbursement — all against the
            same keys and the same balance.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button href="#keys" size="lg">
              Get your API keys
            </Button>
            <Button href="/developers/api" variant="secondary" size="lg">
              API reference
            </Button>
          </div>

          {/* Search sits in the hero rather than the nav: on docs, looking
              something up is the most common reason to be here at all. */}
          <div className="mt-10 max-w-[560px]">
            <DocsSearch />
          </div>
        </Container>
      </section>

      {/* The quickstart. Numbered rather than tabbed — this is a sequence, and
          a reader should be able to scroll it, not hunt for the next step. */}
      <Band id="quickstart" className="bg-bone">
        <Container>
          <SectionHead
            eyebrow="Quickstart"
            title="From nothing to a cleared payment"
            body="Roughly twenty minutes, assuming you already have somewhere to receive a webhook."
          />
          <ol className="mt-12 space-y-12">
            {STEPS.map(({ n, title, body, blocks }) => (
              <li key={n} className="grid gap-7 lg:grid-cols-2 lg:gap-12">
                <div>
                  <p className="display tnum text-[2rem] text-brand">{n}</p>
                  <h3 className="heading mt-2 max-w-[24ch] text-xl">{title}</h3>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {body}
                  </p>
                </div>
                <div className="flex min-w-0 flex-col gap-4">
                  {blocks.map((b) => (
                    <CodeBlock
                      key={b.code}
                      code={b.code}
                      label={"label" in b ? b.label : undefined}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Band>

      <Band id="keys">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow className="text-brand">Keys and environments</Eyebrow>
              <h2 className="heading max-w-[22ch] display-section">
                A sandbox that fails the way production fails
              </h2>
              <p className="mt-6 max-w-[48ch] text-lg text-muted">
                Test keys are prefixed <code className="font-mono text-[15px] text-ink">sk_test_</code>{" "}
                and live keys <code className="font-mono text-[15px] text-ink">sk_live_</code>. The
                sandbox issues real-shaped ids, signs real webhooks, and will
                reject a transfer, return a payout or push a loan into arrears on demand —
                because an integration that has only ever seen the happy path
                is not finished.
              </p>
              <dl className="mt-10 space-y-6">
                {[
                  { icon: ShieldCheck, title: "Secret keys stay on your server", body: "The public key is for the browser and can only start a deposit. Anything that moves money needs the secret." },
                  { icon: Repeat, title: "Idempotent by reference", body: "Send your own reference on every write. Repeat it and you get the original object back rather than a second deposit." },
                  { icon: Code, title: "Same paths in both environments", body: "Going live is a key swap. No base URL to change, no flag to flip." },
                ].map(({ icon: Icon, title, body }) => (
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
            </div>

            <div className="min-w-0 lg:pt-12">
              <CodeBlock
                label="Forcing a failure in the sandbox"
                code={`# A user who always rejects an incoming transfer
curl ${BASE_URL}/transfers \\
  -H "Authorization: Bearer sk_test_4c81d9" \\
  -d from=usr_test_0001 \\
  -d to=usr_test_reject \\
  -d amount=25000

# An account that returns the payout
curl ${BASE_URL}/withdrawals \\
  -H "Authorization: Bearer sk_test_4c81d9" \\
  -d amount=100000 \\
  -d bank_code=058 \\
  -d account_number=0000000001`}
              />
              <p className="mt-4 text-[14px] leading-relaxed text-muted">
                Every test user and account number is listed in the
                reference, alongside the exact error each one raises.
              </p>
            </div>
          </div>
        </Container>
      </Band>

      <Band id="webhooks" className="bg-bone">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-20">
            <div>
              <Eyebrow className="text-brand">Webhooks</Eyebrow>
              <h2 className="heading max-w-[24ch] display-section">
                Signed, retried, and the only thing worth believing
              </h2>
              <p className="mt-6 max-w-[52ch] text-lg text-muted">
                Every event carries an{" "}
                <code className="font-mono text-[15px] text-ink">X-Tribe-Signature</code>{" "}
                header: an HMAC-SHA512 of the raw body, keyed with your secret.
                Compare it in constant time, against the raw bytes — not the
                parsed object, which your framework may have reordered.
              </p>
              <p className="mt-4 max-w-[52ch] text-lg text-muted">
                A non-2xx response is retried for 24 hours with a widening
                backoff. Deliveries can arrive more than once and out of order,
                so key your handler on the event id and make it idempotent.
              </p>
              <Button href="/developers/api#webhooks" variant="secondary" size="lg" className="mt-9">
                Every event, with its body
              </Button>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-[15px] font-bold">Events you will handle first</h3>
              <ul className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">
                {WEBHOOK_EVENTS.slice(0, 6).map(({ name, detail }) => (
                  <li key={name} className="px-5 py-3.5">
                    <Link
                      href={`/developers/api#event-${name.replace(/\./g, "-")}`}
                      className="font-mono text-[13px] font-semibold text-brand underline decoration-transparent underline-offset-4 transition-colors hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {name}
                    </Link>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">
                      {detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Band>

      {/* The short form. /security carries the long one and links back here. */}
      <Band id="security">
        <Container>
          <SectionHead
            eyebrow="Security"
            title="Four things to get right before the live key goes in"
            body="The practices that matter on an integration, rather than a badge row. How Tribe itself is run is on the security page."
          />
          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {SECURITY.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <dt className="flex items-center gap-4 font-semibold">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  {title}
                </dt>
                <dd className="mt-1 max-w-[46ch] pl-[60px] text-[15px] leading-relaxed text-muted">
                  {body}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Button href="/security" variant="secondary" size="lg">
              How Tribe is secured
            </Button>
            <TextLink href="/security#disclosure">
              Report a vulnerability
            </TextLink>
          </div>
        </Container>
      </Band>

      <SdkFlow />

      <Band id="go-live">
        <Container>
          <div className="rounded-2xl bg-plum px-7 py-10 text-white sm:px-10">
            <h2 className="heading max-w-[24ch] display-section">
              Before you switch the live key on
            </h2>
            <ul className="mt-7 grid gap-4 lg:grid-cols-2 lg:gap-x-10">
              {GO_LIVE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-white/75">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button href="/developers/api" variant="onDark" size="lg">
                Read the reference
              </Button>
              <TextLink href="/developers/api#errors" tone="onDark">
                Error codes
              </TextLink>
            </div>
          </div>
        </Container>
      </Band>
    </>
  );
}

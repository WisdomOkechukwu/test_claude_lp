"use client";

import { useState } from "react";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { Button, TextLink } from "@/components/ui/button";
import { Bank, Check, Clock, Close, Code, Phone, ShieldCheck, Users } from "@/components/ui/icons";
import { roveTabs } from "@/components/ui/tablist";

/* A status page has to be legible at a glance and honest in the detail, which
   means resisting the urge to render everything green.

   Ninety days of history per service, hard-coded: these render on the server
   and again on the client, so a generated or randomised bar would be a
   hydration mismatch — the same rule the mockups follow. Days are relative
   ("6 days ago"), never a computed date, for the same reason.

   The two audiences get separate boards because they fail separately: the
   customer app going down does not stop a business's webhooks, and a business
   reading this page wants to know about the API, not the App Store. */
type State = "up" | "degraded" | "down" | "maintenance";

const STATE: Record<State, { label: string; dot: string; bar: string; text: string }> = {
  /* brand on brand-soft is 6.9:1, accent-ink on accent-soft 7.8:1 — the one
     orange CLAUDE.md sanctions as text. Nothing here relies on colour alone:
     every state is spelled out in words beside it. */
  up: { label: "Operational", dot: "bg-brand", bar: "bg-brand", text: "text-brand" },
  degraded: { label: "Degraded", dot: "bg-accent", bar: "bg-accent", text: "text-accent-ink" },
  down: { label: "Outage", dot: "bg-plum", bar: "bg-plum", text: "text-plum" },
  maintenance: { label: "Maintenance", dot: "bg-muted", bar: "bg-muted", text: "text-muted" },
};

type Service = {
  name: string;
  detail: string;
  icon: typeof Bank;
  state: State;
  uptime: string;
  /* Days in the last ninety that were not fully operational, as
     [days-ago, state] — everything else draws as up. */
  blips?: [number, State][];
};

const BOARDS = {
  business: {
    label: "Business and API",
    services: [
      { name: "Collections API", detail: "Payment links, deposits, NQR codes", icon: Code, state: "up", uptime: "99.98%" },
      { name: "Withdrawals and settlement", detail: "Payouts over NIBSS Instant Payment", icon: Bank, state: "up", uptime: "99.95%", blips: [[12, "degraded"], [13, "degraded"]] },
      { name: "Webhooks", detail: "Delivery and retries", icon: ShieldCheck, state: "up", uptime: "99.99%" },
      { name: "Loan tracking", detail: "Positions, repayments, arrears alerts", icon: Users, state: "up", uptime: "100%" },
      { name: "Bulk disbursement", detail: "Airtime, data, electricity, cable, internet", icon: Phone, state: "degraded", uptime: "99.71%", blips: [[0, "degraded"], [31, "down"], [32, "degraded"]] },
      { name: "Dashboard", detail: "Sign-in, approvals, exports", icon: Clock, state: "up", uptime: "99.97%" },
    ] as Service[],
  },
  app: {
    label: "Customer app",
    services: [
      { name: "Sign-in", detail: "Devices, two-factor, sessions", icon: ShieldCheck, state: "up", uptime: "99.99%" },
      { name: "Transfers", detail: "To any Nigerian bank, and cashpoint to cashpoint", icon: Bank, state: "up", uptime: "99.96%", blips: [[47, "degraded"]] },
      { name: "Bills and airtime", detail: "MTN, Airtel, Glo, 9mobile, DStv, GOtv, PHED", icon: Phone, state: "degraded", uptime: "99.68%", blips: [[0, "degraded"], [31, "down"], [32, "degraded"]] },
      { name: "Gift cards", detail: "Rates, trades and payouts", icon: Users, state: "up", uptime: "99.93%" },
      { name: "Card-free top-up", detail: "Funding a balance by transfer", icon: Code, state: "maintenance", uptime: "99.90%", blips: [[0, "maintenance"]] },
    ] as Service[],
  },
} as const;

type BoardKey = keyof typeof BOARDS;
const BOARD_KEYS = Object.keys(BOARDS) as BoardKey[];

const DAYS = 90;

const INCIDENTS = [
  {
    when: "Today",
    title: "Slow airtime and data top-ups on one upstream biller",
    state: "degraded" as State,
    body: "One aggregator is queueing rather than failing, so some MTN and Glo lines are landing minutes late rather than in seconds. Nothing is lost — every queued line either completes or refunds itself. We are moving affected traffic to a second route.",
    updates: [
      ["Latest", "Roughly a third of airtime volume is still routed through the slow path. Electricity, cable and internet are unaffected."],
      ["Earlier", "Identified as upstream. Bulk runs already in flight will finish; new runs are being split across routes."],
    ],
  },
  {
    when: "31 days ago",
    title: "Bulk disbursement outage for 42 minutes",
    state: "down" as State,
    body: "A bad deploy to the disbursement worker rejected every new run with a 500 for 42 minutes. Runs already in flight completed normally. Every rejected run was safe to retry on the same reference, and nothing was double-paid.",
    updates: [
      ["Resolved", "Rolled back. Full service restored, and the release that caused it now has a staged rollout behind it."],
      ["Cause", "A schema change shipped ahead of the migration that supported it."],
    ],
  },
  {
    when: "47 days ago",
    title: "Transfers to two banks slower than usual",
    state: "degraded" as State,
    body: "NIBSS reported elevated latency to two receiving institutions for about three hours. Transfers completed, but some took minutes instead of seconds.",
    updates: [["Resolved", "Latency returned to normal upstream. No transfers were lost or reversed."]],
  },
];

function History({ blips }: { blips?: [number, State][] }) {
  const map = new Map<number, State>(blips ?? []);

  return (
    <div className="flex items-end gap-[2px]" aria-hidden="true">
      {Array.from({ length: DAYS }, (_, i) => {
        /* Oldest on the left, today on the right. */
        const daysAgo = DAYS - 1 - i;
        const state = map.get(daysAgo) ?? "up";
        return (
          <span
            key={daysAgo}
            className={`h-7 w-full rounded-[1px] ${state === "up" ? "bg-brand/25" : STATE[state].bar}`}
          />
        );
      })}
    </div>
  );
}

export function StatusBoard() {
  const [board, setBoard] = useState<BoardKey>("business");
  const services = BOARDS[board].services;

  const worst: State = services.some((s) => s.state === "down")
    ? "down"
    : services.some((s) => s.state === "degraded")
      ? "degraded"
      : services.some((s) => s.state === "maintenance")
        ? "maintenance"
        : "up";

  return (
    <>
      <section className="overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-12">
        <Container>
          <Eyebrow className="text-brand">Service status</Eyebrow>
          <h1 className="display max-w-[16ch] display-hero">
            {worst === "up" ? "Everything is running" : "Most things are running"}
          </h1>
          <p className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-muted">
            Live state for the API, the dashboard and the customer app, with
            ninety days behind it. We post here before we are asked, including
            for the ones that were our fault.
          </p>
        </Container>
      </section>

      <Band id="board" className="bg-bone">
        <Container>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div
              role="tablist"
              aria-label="Which board"
              className="flex flex-wrap gap-1.5 rounded-full bg-white p-1 ring-1 ring-line"
              onKeyDown={(e) =>
                roveTabs(e, BOARD_KEYS.length, BOARD_KEYS.indexOf(board), (n) =>
                  setBoard(BOARD_KEYS[n]),
                )
              }
            >
              {BOARD_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={board === k}
                  tabIndex={board === k ? 0 : -1}
                  onClick={() => setBoard(k)}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    board === k ? "bg-brand text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {BOARDS[k].label}
                </button>
              ))}
            </div>

            <p
              className="flex items-center gap-2.5 text-[15px] font-semibold"
              aria-live="polite"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATE[worst].dot}`}
                aria-hidden="true"
              />
              {worst === "up"
                ? "All systems operational"
                : `${services.filter((s) => s.state !== "up").length} service${
                    services.filter((s) => s.state !== "up").length === 1 ? "" : "s"
                  } not fully operational`}
            </p>
          </div>

          <ul className="mt-8 space-y-4">
            {services.map(({ name, detail, icon: Icon, state, uptime, blips }) => (
              <li
                key={name}
                className="rounded-2xl bg-white p-5 ring-1 ring-line sm:p-6"
              >
                <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1 basis-[180px]">
                    <h2 className="text-[15px] font-bold">{name}</h2>
                    <p className="mt-0.5 text-[13px] text-muted">{detail}</p>
                  </div>
                  <p
                    className={`flex shrink-0 items-center gap-2 text-[13px] font-semibold ${STATE[state].text}`}
                  >
                    {state === "up" ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : state === "down" ? (
                      <Close className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Clock className="h-4 w-4" aria-hidden="true" />
                    )}
                    {STATE[state].label}
                  </p>
                </div>

                <div className="mt-4">
                  <History blips={blips} />
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-3 text-[12px] text-muted">
                    <span>90 days ago</span>
                    <span className="tnum ml-auto font-semibold text-ink">
                      {uptime} uptime
                    </span>
                    <span className="w-full text-right sm:w-auto">Today</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Band>

      <Band id="incidents">
        <Container>
          <h2 className="heading max-w-[22ch] display-section">Recent incidents</h2>
          <p className="mt-5 max-w-[60ch] text-lg text-muted">
            Every incident that affected anyone, with what happened and why.
            Ninety days at a time; older ones stay reachable.
          </p>

          <ol className="mt-12 space-y-10">
            {INCIDENTS.map(({ when, title, state, body, updates }) => (
              <li key={title} className="border-t border-line pt-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      state === "down"
                        ? "bg-brand text-white"
                        : "bg-accent-soft text-accent-ink"
                    }`}
                  >
                    {STATE[state].label}
                  </span>
                  <span className="text-[13px] text-muted">{when}</span>
                </div>
                <h3 className="heading mt-3 max-w-[40ch] text-xl">{title}</h3>
                <p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-muted">
                  {body}
                </p>
                <dl className="mt-5 space-y-3 border-l-2 border-line pl-5">
                  {updates.map(([label, text]) => (
                    <div key={label}>
                      <dt className="text-[13px] font-bold">{label}</dt>
                      <dd className="mt-0.5 max-w-[60ch] text-[14px] leading-relaxed text-muted">
                        {text}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>

          <div className="mt-14 rounded-2xl bg-plum px-7 py-10 text-white sm:px-10">
            <h2 className="heading max-w-[24ch] display-section">
              Told before you have to ask
            </h2>
            <p className="mt-5 max-w-[56ch] text-lg text-white/75">
              Anything that affects money moving is posted here as we find it,
              not once it is fixed. If you integrate against Tribe, the webhook
              you already handle is the faster signal —{" "}
              <code className="font-mono text-[15px] text-accent">
                withdrawal.returned
              </code>{" "}
              and{" "}
              <code className="font-mono text-[15px] text-accent">
                deposit.failed
              </code>{" "}
              fire whether or not anything is written on this page.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button href="/developers/api#webhooks" variant="onDark" size="lg">
                Webhook events
              </Button>
              <TextLink href="/security#disclosure" tone="onDark">
                Report a vulnerability
              </TextLink>
            </div>
          </div>
        </Container>
      </Band>
    </>
  );
}

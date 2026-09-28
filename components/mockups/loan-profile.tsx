"use client";

import { useState } from "react";
import { Check, Clock, Fingerprint, Repeat } from "@/components/ui/icons";
import { naira } from "./format";
import { roveTabs } from "@/components/ui/tablist";

/* This replaces a batch "repayment run" that showed five names cascading from
   queued to paid. It looked busy and answered the wrong question: a lender
   already knows what today's run collected. What they cannot see anywhere else
   is where one borrower stands — how much of the loan has come back, how much
   is still out, and when the next debit fires.

   Every figure is hard-coded. These render on the server and again on the
   client, so anything derived from Math.random(), Date.now() or new Date()
   would be a hydration bug. Time is relative for the same reason: "in 6 days"
   is stable, a computed date is not. Amounts paid are stored; what remains is
   derived, so the two can never disagree. */

type Repayment = { when: string; amount: number; outcome: string };

type Borrower = {
  id: string;
  name: string;
  loanRef: string;
  channel: string;
  bank: string;
  principal: number;
  totalRepayable: number;
  paid: number;
  instalment: number;
  instalmentsPaid: number;
  instalmentsTotal: number;
  due: string;
  status: "on_track" | "arrears" | "settled";
  /* Days past due, for the borrower who has slipped. */
  arrears?: number;
  /* The borrower who is behind: "Record a repayment" applies one instalment.
     Fixed, not random, for the reason above. */
  recordable?: boolean;
  history: Repayment[];
};

const BORROWERS: Borrower[] = [
  {
    id: "usr_7Qd2mWc",
    name: "Chinedu Okafor",
    loanRef: "loan_6Hs1tYv",
    channel: "Repays by transfer",
    bank: "GTBank",
    principal: 450_000,
    totalRepayable: 540_000,
    paid: 315_000,
    instalment: 36_000,
    instalmentsPaid: 9,
    instalmentsTotal: 15,
    due: "in 6 days",
    status: "on_track",
    history: [
      { when: "This month", amount: 36_000, outcome: "Paid" },
      { when: "Last month", amount: 36_000, outcome: "Paid" },
      { when: "Two months ago", amount: 36_000, outcome: "Paid" },
    ],
  },
  {
    id: "usr_2Kf9pRv",
    name: "Amaka Balogun",
    loanRef: "loan_9Wq4dRn",
    channel: "Repays by transfer",
    bank: "Kuda",
    principal: 200_000,
    totalRepayable: 232_000,
    paid: 58_000,
    instalment: 29_000,
    instalmentsPaid: 2,
    instalmentsTotal: 8,
    due: "in 11 days",
    status: "on_track",
    history: [
      { when: "This month", amount: 29_000, outcome: "Paid" },
      { when: "Last month", amount: 29_000, outcome: "Paid" },
    ],
  },
  {
    id: "usr_4Rm7cZp",
    name: "Tobi Adeyemi",
    loanRef: "loan_4Rm7cZp",
    channel: "Repays in cash",
    bank: "Recorded by hand",
    principal: 150_000,
    totalRepayable: 180_000,
    paid: 90_000,
    instalment: 15_000,
    instalmentsPaid: 6,
    instalmentsTotal: 12,
    due: "12 days ago",
    status: "arrears",
    arrears: 12,
    recordable: true,
    history: [
      { when: "This month", amount: 15_000, outcome: "Missed — nothing recorded" },
      { when: "Last month", amount: 15_000, outcome: "Paid late, in cash" },
      { when: "Two months ago", amount: 15_000, outcome: "Paid" },
    ],
  },
  {
    id: "usr_8Yn3kQw",
    name: "Hauwa Suleiman",
    loanRef: "loan_8Yn3kQw",
    channel: "Repays from balance",
    bank: "Tribe balance",
    principal: 600_000,
    totalRepayable: 726_000,
    paid: 484_000,
    instalment: 22_000,
    instalmentsPaid: 22,
    instalmentsTotal: 33,
    due: "in 2 days",
    status: "on_track",
    history: [
      { when: "This week", amount: 22_000, outcome: "Paid from Tribe balance" },
      { when: "Last week", amount: 22_000, outcome: "Paid from Tribe balance" },
      { when: "Two weeks ago", amount: 22_000, outcome: "Paid from Tribe balance" },
    ],
  },
  {
    id: "usr_1Pv6zAx",
    name: "Ifeanyi Nwosu",
    loanRef: "loan_1Pv6zAx",
    channel: "Repays by transfer",
    bank: "Zenith Bank",
    principal: 90_000,
    totalRepayable: 103_500,
    paid: 103_500,
    instalment: 11_500,
    instalmentsPaid: 9,
    instalmentsTotal: 9,
    due: "nothing outstanding",
    status: "settled",
    history: [
      { when: "This month", amount: 11_500, outcome: "Paid — loan settled" },
      { when: "Last month", amount: 11_500, outcome: "Paid" },
      { when: "Two months ago", amount: 11_500, outcome: "Paid" },
    ],
  },
];

const STATUS: Record<Borrower["status"], { label: string; className: string }> = {
  /* brand on brand-soft is 6.9:1; accent-ink on accent-soft is 7.8:1 — the one
     orange CLAUDE.md sanctions as text. */
  on_track: { label: "On track", className: "bg-brand-soft text-brand" },
  arrears: { label: "In arrears", className: "bg-accent-soft text-accent-ink" },
  settled: { label: "Settled", className: "bg-brand text-white" },
};

export function LoanProfile() {
  const [selected, setSelected] = useState(BORROWERS[0].id);
  /* Which borrowers have had the outstanding instalment collected by hand. */
  const [collected, setCollected] = useState<string[]>([]);

  const base = BORROWERS.find((b) => b.id === selected) ?? BORROWERS[0];
  const justRecorded = collected.includes(base.id);

  const paid = justRecorded ? base.paid + base.instalment : base.paid;
  const instalmentsPaid = justRecorded
    ? base.instalmentsPaid + 1
    : base.instalmentsPaid;
  const remaining = base.totalRepayable - paid;
  const status = justRecorded && base.status === "arrears" ? "on_track" : base.status;
  const pct = Math.round((paid / base.totalRepayable) * 100);
  const tone = STATUS[status];

  return (
    <div className="w-full max-w-[460px] rounded-xl bg-white p-6 ring-1 ring-line sm:p-7">
      {/* Roving arrow keys, per the tabs pattern — a tablist that only responds
          to clicks strands a keyboard user on the first tab. */}
      <div
        role="tablist"
        aria-label="Borrower"
        className="flex flex-wrap gap-1.5"
        onKeyDown={(e) =>
          roveTabs(
            e,
            BORROWERS.length,
            BORROWERS.findIndex((b) => b.id === selected),
            (n) => setSelected(BORROWERS[n].id),
          )
        }
      >
        {BORROWERS.map((b) => {
          const on = b.id === selected;
          return (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setSelected(b.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                on
                  ? "bg-brand text-white"
                  : "bg-bone text-muted hover:bg-line hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  on ? "bg-white/20 text-white" : "bg-white text-brand"
                }`}
              >
                {b.name.charAt(0)}
              </span>
              {b.name.split(" ")[0]}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-start gap-x-3 gap-y-2 border-t border-line pt-5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold">{base.name}</h3>
          <p className="truncate font-mono text-[12px] text-muted">
            {base.loanRef}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${tone.className}`}
        >
          {tone.label}
        </span>
      </div>

      {/* The two figures the whole section exists to show. */}
      <div className="mt-5" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="text-[13px] text-muted">Paid so far</p>
            <p className="tnum text-2xl font-bold text-brand">{naira(paid)}</p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[13px] text-muted">Still to collect</p>
            <p className="tnum text-2xl font-bold">{naira(remaining)}</p>
          </div>
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-bone"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Share of ${base.name}'s loan repaid`}
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="mt-2.5 text-[13px] text-muted">
          <span className="tnum font-semibold text-ink">
            {instalmentsPaid} of {base.instalmentsTotal}
          </span>{" "}
          instalments · {naira(base.instalment)} each · {naira(base.totalRepayable)}{" "}
          repayable on {naira(base.principal)} lent
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 border-y border-line py-4 text-[13px] sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2">
          <Repeat className="h-4 w-4 shrink-0 text-brand" />
          <dt className="sr-only">How they repay</dt>
          <dd className="min-w-0 truncate">
            {base.channel} · {base.bank}
          </dd>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-brand" />
          <dt className="sr-only">Next instalment</dt>
          <dd className="min-w-0 truncate">
            {status === "settled"
              ? "Nothing outstanding"
              : status === "arrears" && !justRecorded
                ? `Overdue by ${base.arrears} days`
                : `Next instalment due ${base.due}`}
          </dd>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:col-span-2">
          <Fingerprint className="h-4 w-4 shrink-0 text-brand" />
          <dt className="sr-only">Identity</dt>
          <dd className="min-w-0">BVN and NIN matched before this loan was booked</dd>
        </div>
      </dl>

      <h4 className="mt-4 text-[13px] font-bold">Repayments</h4>
      <ul className="mt-2 divide-y divide-line">
        {base.history.map((h) => (
          <li key={h.when} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2.5 last:pb-0">
            <span className="min-w-0 text-[13px] font-semibold">{h.when}</span>
            <span className="tnum ml-auto shrink-0 text-[13px] font-semibold">
              {naira(h.amount)}
            </span>
            <span className="w-full text-[12px] text-muted">{h.outcome}</span>
          </li>
        ))}
      </ul>

      {base.recordable && !justRecorded ? (
        <button
          type="button"
          onClick={() => setCollected((c) => [...c, base.id])}
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Repeat className="h-4 w-4" />
          Record {naira(base.instalment)} repayment
        </button>
      ) : (
        <p className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-bone px-4 text-[13px] font-semibold text-muted">
          <Check className="h-4 w-4 shrink-0 text-brand" />
          {status === "settled"
            ? "Settled — nothing left to collect"
            : justRecorded
              ? "Recorded. The borrower is back on schedule."
              : "On schedule, nothing outstanding"}
        </p>
      )}
    </div>
  );
}

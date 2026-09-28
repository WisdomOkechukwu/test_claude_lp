"use client";

import Image from "next/image";

import { useState } from "react";
import { Check, Clock, Repeat } from "@/components/ui/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { naira } from "./format";

const CADENCES = {
  weekly: { label: "Weekly", perMonth: 4 },
  monthly: { label: "Monthly", perMonth: 1 },
  quarterly: { label: "Quarterly", perMonth: 1 / 3 },
} as const;

type Cadence = keyof typeof CADENCES;

/* Each row carries the provider's own mark rather than a generic category
   icon — a recurring bill is "the DStv one", not "the television one", and the
   logo is how anybody finds theirs in a list.

   Marks come from `assetx/`, copied into `public/img/billers/` because nothing
   under `assetx/` is served. Spectranet is not in that set, so the fourth row
   is GOtv; see `components/mockups/billers.tsx` for the same six on the
   customer page. */
const BILLS = [
  { id: "mtn", provider: "MTN", logo: "/img/billers/mtn.png", name: "MTN airtime", detail: "0803 •••• 214", amount: 2_000, cadence: "weekly" as Cadence, on: true },
  { id: "phed", provider: "PHED", logo: "/img/billers/phed.png", name: "PHED prepaid", detail: "Meter 4512 8890", amount: 15_000, cadence: "monthly" as Cadence, on: true },
  { id: "dstv", provider: "DStv", logo: "/img/billers/dstv.jpg", name: "DStv Compact", detail: "IUC 7025 4418", amount: 10_500, cadence: "monthly" as Cadence, on: false },
  { id: "gotv", provider: "GOtv", logo: "/img/billers/gotv.jpg", name: "GOtv Max", detail: "IUC 2044 1187", amount: 8_500, cadence: "monthly" as Cadence, on: true },
];

export function RecurringUtilities() {
  const [state, setState] = useState(() =>
    Object.fromEntries(
      BILLS.map((b) => [b.id, { on: b.on, cadence: b.cadence }]),
    ) as Record<string, { on: boolean; cadence: Cadence }>,
  );

  const active = BILLS.filter((b) => state[b.id].on);
  const monthly = active.reduce(
    (sum, b) => sum + b.amount * CADENCES[state[b.id].cadence].perMonth,
    0,
  );

  return (
    <div className="w-full max-w-[460px] rounded-xl bg-white p-6 text-ink ring-1 ring-line sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Repeat className="h-5 w-5" />
        </span>
        <h3 className="text-[15px] font-bold">Recurring bills</h3>
        <span
          className="tnum ml-auto rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-bold text-brand"
          aria-live="polite"
        >
          {active.length} on
        </span>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {BILLS.map(({ id, provider, logo, name, detail, amount }) => {
          const row = state[id];
          return (
            <li key={id} className="py-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`ru-${id}`}
                  checked={row.on}
                  onChange={(on) => setState((st) => ({ ...st, [id]: { ...st[id], on } }))}
                  className="min-w-0 flex-1"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {/* Dimmed rather than greyed when the schedule is off — it
                        is still the same bill, just not running. */}
                    <Image
                      src={logo}
                      alt={provider}
                      width={200}
                      height={200}
                      sizes="40px"
                      className={`h-10 w-10 shrink-0 rounded-lg object-cover transition-opacity ${
                        row.on ? "opacity-100" : "opacity-40"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold">
                        {name}
                      </span>
                      <span className="tnum block text-[12px] text-muted">
                        {detail}
                      </span>
                    </span>
                  </span>
                </Checkbox>
                <span className="tnum ml-auto shrink-0 text-[14px] font-semibold">
                  {naira(amount)}
                </span>
              </div>

              {row.on && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 sm:pl-[68px]">
                  {(Object.keys(CADENCES) as Cadence[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setState((s) => ({ ...s, [id]: { ...s[id], cadence: c } }))
                      }
                      aria-pressed={row.cadence === c}
                      className={`inline-flex min-h-11 items-center rounded-full px-3 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        row.cadence === c
                          ? "bg-brand-soft text-brand"
                          : "text-muted hover:bg-bone"
                      }`}
                    >
                      {CADENCES[c].label}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* No day picker. A schedule that asks "which day of the month" before it
          has run once is a decision nobody can make yet — each bill simply
          starts at the beginning of whatever period it is set to, and the app
          lets you move it afterwards if the date turns out to be wrong. */}
      <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        Each bill starts at the beginning of its period — weekly on the Monday,
        monthly on the 1st, quarterly on the 1st of the quarter.
      </p>

      <div className="mt-3 flex items-baseline" aria-live="polite">
        <span className="text-[14px] text-muted">Roughly each month</span>
        <span className="tnum ml-auto text-xl font-bold">{naira(monthly)}</span>
      </div>

      <button
        type="button"
        disabled={active.length === 0}
        className="mt-5 h-12 w-full rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {active.length === 0 ? "Pick a bill first" : "Turn on auto-pay"}
      </button>

      <p className="mt-3 flex items-center gap-2 text-[12px] text-muted">
        <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
        We warn you the day before, and skip the run if your balance is short
      </p>
    </div>
  );
}

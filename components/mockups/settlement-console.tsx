"use client";

import { useState } from "react";
import { Bank, Check, Clock, Split } from "@/components/ui/icons";
import { naira } from "./format";
import { roveTabs } from "@/components/ui/tablist";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const GROSS = 2_480_000;

/* One settlement price, whichever cadence you pick: 0.5% capped at ₦1,000.
   The cap is the part that matters — above ₦200,000 the percentage stops, so a
   large payout costs the same as a medium one. Keep this in step with the fee
   table in components/coverage.tsx. */
const RATE = 0.005;
const CAP = 1000;
const FEE_NOTE = "0.5%, capped at ₦1,000";

const CADENCES = {
  instant: {
    label: "Instant",
    arrival: "In about 90 seconds, any hour",
    note: "Settled over NIP",
  },
  next: {
    label: "T+1",
    arrival: "Tomorrow before 09:00",
    note: "Default for new accounts",
  },
  weekly: {
    label: "Weekly",
    arrival: "Monday before 09:00",
    note: "Batched into one payout",
  },
} as const;

type Cadence = keyof typeof CADENCES;

/* Masked account numbers — the last four digits are all a dashboard shows. */
const BANKS = [
  { name: "GTBank", tail: "4471" },
  { name: "Zenith Bank", tail: "9032" },
  { name: "Access Bank", tail: "1185" },
  { name: "UBA", tail: "7724" },
  { name: "First Bank", tail: "3690" },
  { name: "Kuda", tail: "5518" },
  { name: "Moniepoint", tail: "2047" },
  { name: "Opay", tail: "8863" },
] as const;

export function SettlementConsole() {
  const [cadence, setCadence] = useState<Cadence>("next");
  const [bank, setBank] = useState(0);
  const [split, setSplit] = useState(false);
  const [share, setShare] = useState(70);

  const fee = Math.min(GROSS * RATE, CAP);
  const net = GROSS - fee;

  return (
    <div className="w-full max-w-[440px] rounded-xl bg-white p-6 text-ink ring-1 ring-line sm:p-7">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold">Settlement</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Live
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Withdrawal cadence"
        className="mt-4 flex gap-1.5 rounded-full bg-bone p-1"
        onKeyDown={(e) => {
          const keys = Object.keys(CADENCES) as Cadence[];
          roveTabs(e, keys.length, keys.indexOf(cadence), (n) =>
            setCadence(keys[n]),
          );
        }}
      >
        {(Object.keys(CADENCES) as Cadence[]).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cadence === c}
            tabIndex={cadence === c ? 0 : -1}
            onClick={() => setCadence(c)}
            className={`min-h-11 flex-1 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              cadence === c
                ? "bg-white text-brand shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {CADENCES[c].label}
          </button>
        ))}
      </div>

      <dl className="mt-5 space-y-2.5 text-[15px]" aria-live="polite">
        <div className="flex items-baseline">
          <dt className="text-muted">Gross collected</dt>
          <dd className="tnum ml-auto font-semibold">{naira(GROSS)}</dd>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3">
          <dt className="min-w-0 text-muted">
            Settlement fee
            <span className="ml-1 text-[13px] text-muted">{FEE_NOTE}</span>
          </dt>
          <dd className="tnum ml-auto font-semibold">
            {fee > 0 ? `− ${naira(fee)}` : "₦0"}
          </dd>
        </div>
        <div className="flex items-baseline border-t border-line pt-3">
          <dt className="font-semibold">Net payout</dt>
          <dd className="tnum ml-auto text-xl font-bold">{naira(net)}</dd>
        </div>
      </dl>

      <div className="mt-4 space-y-3 rounded-2xl bg-bone p-4">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
          <Clock className="h-4 w-4 shrink-0 text-brand" />
          <span className="font-semibold">{CADENCES[cadence].arrival}</span>
          <span className="text-muted min-[420px]:ml-auto">{CADENCES[cadence].note}</span>
        </p>
        {/* A div, not a p: Select renders a div, and a <p> silently closes
            itself before one — which the browser then reopens after, so the
            server HTML and the client tree disagree and hydration fails.
            The sr-only label that used to sit here is gone too: Select owns its
            own label, and this one pointed at the trigger button. */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
          <Bank className="h-4 w-4 shrink-0 text-brand" />
          <Select
            id="stl-bank"
            label="Bank this settles to"
            value={String(bank)}
            onChange={(v) => setBank(Number(v))}
            options={BANKS.map((b, i) => ({
              value: String(i),
              label: b.name,
              hint: `•••• ${b.tail}`,
            }))}
            className="min-w-0 flex-1"
          />
        </div>
      </div>

      <Checkbox checked={split} onChange={setSplit} className="mt-4">
        <span className="flex items-center gap-2 text-[14px] font-semibold">
          <Split className="h-4 w-4 shrink-0 text-brand" />
          Split settlement
        </span>
      </Checkbox>

      {split && (
        <div className="mt-3 space-y-3 rounded-2xl border border-line p-4">
          <label htmlFor="stl-split" className="sr-only">
            Main account share
          </label>
          <p className="flex items-baseline justify-between text-[13px]">
            <span className="font-semibold">Main account share</span>
            <span className="tnum font-semibold text-brand">{share}%</span>
          </p>
          {/* The readout above the track, not below it: a thumb being dragged
              on a phone covers everything under the finger. */}
          <input
            id="stl-split"
            type="range"
            min={10}
            max={90}
            step={5}
            value={share}
            onChange={(e) => setShare(Number(e.target.value))}
            className="h-11 w-full accent-brand"
          />
          <div className="flex items-baseline text-[14px]">
            <span className="text-muted">Main account</span>
            <span className="tnum ml-auto font-semibold">
              {share}% · {naira((net * share) / 100)}
            </span>
          </div>
          <div className="flex items-baseline text-[14px]">
            <span className="text-muted">Vendor pool</span>
            <span className="tnum ml-auto font-semibold">
              {100 - share}% · {naira((net * (100 - share)) / 100)}
            </span>
          </div>
          <p className="flex items-center gap-2 text-[12px] text-muted">
            <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
            Both legs settle in the same NIP batch
          </p>
        </div>
      )}
    </div>
  );
}

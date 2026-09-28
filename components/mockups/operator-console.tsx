"use client";

import { useState } from "react";
import { Check, ShieldCheck, Users } from "@/components/ui/icons";
import { naira } from "./format";
import { Checkbox } from "@/components/ui/checkbox";

const QUEUE = [
  { id: "vendor", name: "Vendor pool", detail: "Zenith ••9032", amount: 740_280 },
  { id: "payroll", name: "Payroll run", detail: "42 staff accounts", amount: 1_284_000 },
  { id: "refund", name: "Refund batch", detail: "6 customers", amount: 96_500 },
] as const;

export function OperatorConsole({ className = "" }: { className?: string }) {
  const [picked, setPicked] = useState<string[]>(["vendor"]);
  const [approved, setApproved] = useState<string[]>([]);

  const pending = QUEUE.filter((q) => !approved.includes(q.id));
  const total = QUEUE.filter((q) => picked.includes(q.id)).reduce(
    (sum, q) => sum + q.amount,
    0,
  );

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function approve() {
    setApproved((a) => [...new Set([...a, ...picked])]);
    setPicked([]);
  }

  return (
    <div className={`w-full rounded-xl bg-white p-6 ring-1 ring-line sm:p-7 ${className}`}>
      <div className="flex items-center gap-3">
        <h3 className="text-[15px] font-bold">Awaiting your approval</h3>
        <span className="tnum ml-auto rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-bold text-brand">
          {pending.length}
        </span>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {QUEUE.map((q) => {
          const done = approved.includes(q.id);
          return (
            <li key={q.id}>
              {done ? (
                /* Approved rows are a record, not a control — a checkbox you
                   cannot uncheck is a lie about what is still possible. */
                <p className="flex items-center gap-3 py-3 opacity-45">
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-[7px] bg-brand"
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold">
                      {q.name}
                    </span>
                    <span className="block text-[12px] text-muted">
                      Approved · queued for NIP
                    </span>
                  </span>
                  <span className="tnum ml-auto shrink-0 text-[14px] font-semibold">
                    {naira(q.amount)}
                  </span>
                </p>
              ) : (
                <Checkbox
                  checked={picked.includes(q.id)}
                  onChange={() => toggle(q.id)}
                  className="py-1.5"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold">
                        {q.name}
                      </span>
                      <span className="block text-[12px] text-muted">
                        {q.detail}
                      </span>
                    </span>
                    <span className="tnum ml-auto shrink-0 text-[14px] font-semibold">
                      {naira(q.amount)}
                    </span>
                  </span>
                </Checkbox>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={approve}
        disabled={picked.length === 0}
        className="mt-4 h-12 w-full rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {picked.length === 0
          ? pending.length === 0
            ? "All caught up"
            : "Select a payout"
          : `Approve ${naira(total)}`}
      </button>

      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
        Two approvers required above ₦1m
        <Users className="ml-auto h-3.5 w-3.5 shrink-0 text-brand max-[420px]:ml-0" />
        Roles and limits per staff member
      </p>
    </div>
  );
}

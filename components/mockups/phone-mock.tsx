"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bank,
  Check,
  Clock,
  LinkIcon,
  Wallet,
  Wifi,
} from "@/components/ui/icons";
import { naira } from "./format";
import { roveTabs } from "@/components/ui/tablist";

const TABS = [
  { id: "account", label: "Account", Icon: Wallet },
  { id: "collect", label: "Collect", Icon: LinkIcon },
  { id: "settle", label: "Settle", Icon: Bank },
] as const;

type Tab = (typeof TABS)[number]["id"];

const TXNS = [
  { dir: "in", name: "Ada Designs · link", amount: 45_000 },
  { dir: "out", name: "Bulk airtime run", amount: 82_000 },
  { dir: "in", name: "Loan repayment sweep", amount: 128_000 },
  { dir: "out", name: "Vendor payout · Zenith", amount: 60_000 },
] as const;

const LINKS = [
  { name: "September retainer", amount: 250_000, paid: true },
  { name: "Logistics · batch 14", amount: 96_500, paid: true },
  { name: "Fabric deposit", amount: 35_000, paid: false },
] as const;

export function PhoneMock({ className = "" }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("account");

  return (
    <div
      className={`relative aspect-[9/18.5] w-full max-w-[280px] rounded-[2.6rem] border-[7px] border-ink bg-white ring-1 ring-line ${className}`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] px-4 pt-3">
        <div className="flex items-center justify-between text-[11.5px] font-semibold">
          <span className="tnum">9:41</span>
          <span className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            <span
              className="inline-block h-2.5 w-5 rounded-[3px] border border-ink"
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-full bg-brand text-[12px] font-bold text-white"
            aria-hidden="true"
          >
            T
          </span>
          <span className="text-[13px] font-bold">
            {TABS.find((t) => t.id === tab)?.label}
          </span>
        </div>

        <div className="no-scrollbar mt-3 flex-1 overflow-y-auto">
          {tab === "account" && (
            <>
              <div className="rounded-xl bg-brand p-3 text-white">
                <p className="text-[11px] uppercase tracking-wider opacity-70">
                  Available balance
                </p>
                <p className="tnum mt-1 text-xl font-bold leading-none">
                  {naira(2_486_400)}
                </p>
                <p className="mt-1 text-[11px] opacity-70">NGN · Main account</p>
              </div>
              <p className="mt-4 text-[11.5px] font-semibold text-muted">
                Recent activity
              </p>
              <ul className="divide-y divide-line">
                {TXNS.map((t) => (
                  <li key={t.name} className="flex items-center gap-2.5 py-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bone">
                      {t.dir === "in" ? (
                        <ArrowDown className="h-3.5 w-3.5 text-brand" />
                      ) : (
                        <ArrowUp className="h-3.5 w-3.5 text-muted" />
                      )}
                    </span>
                    <span className="truncate text-[11px] text-muted">
                      {t.name}
                    </span>
                    <span className="tnum ml-auto shrink-0 text-[11px] font-semibold">
                      {t.dir === "in" ? "+" : "−"}
                      {naira(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "collect" && (
            <>
              <div className="rounded-xl bg-bone p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted">
                  Collected today
                </p>
                <p className="tnum mt-1 text-xl font-bold leading-none">
                  {naira(381_500)}
                </p>
                <p className="mt-1 text-[11px] text-muted">Across 3 links</p>
              </div>
              <p className="mt-4 text-[11.5px] font-semibold text-muted">
                Payment links
              </p>
              <ul className="divide-y divide-line">
                {LINKS.map((l) => (
                  <li key={l.name} className="flex items-center gap-2.5 py-2.5">
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold">
                        {l.name}
                      </span>
                      <span className="tnum block text-[11.5px] text-muted">
                        {naira(l.amount)}
                      </span>
                    </span>
                    <span
                      className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        l.paid
                          ? "bg-brand text-white"
                          : "bg-accent-soft text-accent-ink"
                      }`}
                    >
                      {l.paid ? "Paid" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "settle" && (
            <>
              <div className="rounded-xl border border-line p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted">
                  Next payout
                </p>
                <p className="tnum mt-1 text-xl font-bold leading-none">
                  {naira(2_467_600)}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted">
                  <Clock className="h-3 w-3 text-brand" />
                  Tomorrow before 09:00
                </p>
              </div>
              <ul className="mt-4 space-y-2.5 text-[11.5px]">
                {[
                  ["Captured", "09:14 today"],
                  ["Batched", "23:00 tonight"],
                  ["Sent to NIP", "06:30 tomorrow"],
                ].map(([step, when]) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft">
                      <Check className="h-3 w-3 text-brand" />
                    </span>
                    <span className="font-semibold">{step}</span>
                    <span className="ml-auto text-muted">{when}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-bone px-2.5 py-2 text-[11.5px] text-muted">
                <Bank className="h-3 w-3 shrink-0 text-brand" />
                GTBank •••• 4471
              </p>
            </>
          )}
        </div>

        <div
          role="tablist"
          aria-label="App screen"
          className="mb-3 flex items-center justify-around border-t border-line pt-2.5"
          onKeyDown={(e) =>
            roveTabs(e, TABS.length, TABS.findIndex((t) => t.id === tab), (n) =>
              setTab(TABS[n].id),
            )
          }
        >
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-lg px-3 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                tab === id ? "text-brand" : "text-muted hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

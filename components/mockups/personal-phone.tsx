"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bolt,
  Check,
  Gift,
  Phone,
  Tv,
  Wallet,
  Wifi,
} from "@/components/ui/icons";
import { naira } from "./format";
import { roveTabs } from "@/components/ui/tablist";

const TABS = [
  { id: "home", label: "Home", Icon: Wallet },
  { id: "send", label: "Send", Icon: ArrowUp },
  { id: "bills", label: "Bills", Icon: Bolt },
] as const;

type Tab = (typeof TABS)[number]["id"];

const TXNS = [
  { dir: "in", name: "Salary · Oct", amount: 420_000 },
  { dir: "out", name: "Chinedu O.", amount: 25_000 },
  { dir: "out", name: "MTN airtime", amount: 2_000 },
  { dir: "in", name: "Giftcard payout", amount: 142_000 },
] as const;

const RECENTS = [
  { name: "Chinedu Okafor", bank: "GTBank" },
  { name: "Amaka Balogun", bank: "Kuda" },
  { name: "Tobi Adeyemi", bank: "Opay" },
] as const;

const BILLS = [
  { name: "MTN airtime", Icon: Phone, amount: 2_000 },
  { name: "Ikeja Electric", Icon: Bolt, amount: 15_000 },
  { name: "DSTV Compact", Icon: Tv, amount: 10_500 },
  { name: "Spectranet", Icon: Wifi, amount: 18_000 },
] as const;

export function PersonalPhone({ className = "" }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("home");

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
            A
          </span>
          <span className="text-[13px] font-bold">
            {TABS.find((t) => t.id === tab)?.label}
          </span>
        </div>

        <div className="no-scrollbar mt-3 flex-1 overflow-y-auto">
          {tab === "home" && (
            <>
              <div className="rounded-xl bg-brand p-3 text-white">
                <p className="text-[11px] uppercase tracking-wider opacity-70">
                  Available balance
                </p>
                <p className="tnum mt-1 text-xl font-bold leading-none">
                  {naira(537_400)}
                </p>
                <p className="mt-1 text-[11px] opacity-70">NGN</p>
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

          {tab === "send" && (
            <>
              <div className="rounded-xl border border-line p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted">
                  Sending
                </p>
                <p className="tnum mt-1 text-xl font-bold leading-none">
                  {naira(25_000)}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-brand">
                  <Check className="h-3 w-3" />
                  ₦0 fee, arrives in seconds
                </p>
              </div>
              <p className="mt-4 text-[11.5px] font-semibold text-muted">
                Send again
              </p>
              <ul className="divide-y divide-line">
                {RECENTS.map((r) => (
                  <li key={r.name} className="flex items-center gap-2.5 py-2.5">
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-[11.5px] font-bold text-brand"
                      aria-hidden="true"
                    >
                      {r.name.charAt(0)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold">
                        {r.name}
                      </span>
                      <span className="block text-[11.5px] text-muted">
                        {r.bank}
                      </span>
                    </span>
                    <ArrowUp className="ml-auto h-3.5 w-3.5 shrink-0 text-brand" />
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "bills" && (
            <>
              <div className="rounded-xl bg-bone p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted">
                  Due this month
                </p>
                <p className="tnum mt-1 text-xl font-bold leading-none">
                  {naira(45_500)}
                </p>
                <p className="mt-1 text-[11px] text-muted">Across 4 bills</p>
              </div>
              <ul className="mt-3 divide-y divide-line">
                {BILLS.map(({ name, Icon, amount }) => (
                  <li key={name} className="flex items-center gap-2.5 py-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate text-[11px] font-semibold">
                      {name}
                    </span>
                    <span className="tnum ml-auto shrink-0 text-[11px]">
                      {naira(amount)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-muted">
                <Gift className="h-3 w-3 shrink-0 text-brand" />
                Save a meter number once, pay in two taps after
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

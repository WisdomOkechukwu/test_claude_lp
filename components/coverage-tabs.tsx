"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bank,
  Bolt,
  Clock,
  Fingerprint,
  Gift,
  LinkIcon,
  Phone,
  Receipt,
  Repeat,
  Split,
  TrendUp,
  Tv,
  Users,
  Vault,
  Wallet,
  Wifi,
} from "@/components/ui/icons";
import { roveTabs } from "@/components/ui/tablist";

/* The interactive half of the coverage section, split out so the section's
   heading and container can stay on the server. The whole section used to be
   a client component for this one piece of state, which meant shipping and
   hydrating markup that never changes. */

type Entry = {
  name: string;
  detail: string;
  cta: string;
  icon: typeof Bolt;
  /* Where the CTA goes. The four tabs map onto the four reference sections,
     so each entry deep-links into the one that documents it. */
  href: string;
};

const TABS: { id: string; label: string; entries: Entry[] }[] = [
  {
    id: "collections",
    label: "Collections",
    entries: [
      { name: "Payment links", detail: "Fix an amount and share it once, or reuse it forever", cta: "Create a link", href: "/developers/api#collections", icon: LinkIcon },
      { name: "Deposits", detail: "Bank transfer or NQR, matched to the customer who paid", cta: "See deposits", href: "/developers/api#collections", icon: Wallet },
      { name: "Bank transfer", detail: "Matched to the right customer automatically", cta: "See transfers", href: "/developers/api#collections", icon: Bank },
      { name: "NQR codes", detail: "Print it, tape it to the counter, get paid", cta: "Generate a code", href: "/developers/api#collections", icon: Receipt },
      { name: "User profiles", detail: "One record per customer, vendor or borrower", cta: "Read the docs", href: "/developers/api#users", icon: Users },
    ],
  },
  {
    id: "settlement",
    label: "Settlement",
    entries: [
      { name: "Instant withdrawal", detail: "Out on NIP in about 90 seconds, any hour", cta: "Enable instant", href: "/developers/api#settlement", icon: Clock },
      { name: "T+1 settlement", detail: "In your bank before 09:00 the next working day", cta: "See the schedule", href: "/developers/api#settlement", icon: Bank },
      { name: "Split settlement", detail: "One payment, routed across many accounts", cta: "Set up a split", href: "/developers/api#settlement", icon: Split },
      { name: "Vaults", detail: "A named balance per branch, each on its own schedule", cta: "Create a vault", href: "/developers/api#settlement", icon: Vault },
      { name: "Reconciliation", detail: "References that match your bank statement", cta: "Export a report", href: "/developers/api#settlement", icon: Receipt },
    ],
  },
  {
    id: "loans",
    label: "Loans",
    entries: [
      { name: "Loan book", detail: "Every borrower, what is paid and what is out", cta: "Read the book", href: "/developers/api#loans", icon: Receipt },
      { name: "Loan profiles", detail: "Paid to date and what is left, per borrower", cta: "Read a loan", href: "/developers/api#loans", icon: TrendUp },
      { name: "Repayments", detail: "Record money back from a deposit or from cash", cta: "Record one", href: "/developers/api#loans", icon: Repeat },
      { name: "Borrower identity", detail: "BVN and NIN matched before you lend", cta: "Verify a borrower", href: "/developers/api#users", icon: Fingerprint },
      { name: "Arrears alerts", detail: "A webhook the day an instalment is missed", cta: "See the event", href: "/developers/api#webhooks", icon: Clock },
    ],
  },
  {
    id: "disbursement",
    label: "Disbursement",
    entries: [
      { name: "Airtime and data", detail: "MTN, Airtel, Glo and 9mobile in bulk", cta: "Run a top-up", href: "/developers/api#disbursement", icon: Phone },
      { name: "Electricity", detail: "Ikeja, EKEDC, AEDC, PHED and more", cta: "Buy a token", href: "/developers/api#disbursement", icon: Bolt },
      { name: "Cable TV", detail: "DSTV, GOtv and StarTimes renewals", cta: "Renew a plan", href: "/developers/api#disbursement", icon: Tv },
      { name: "Internet", detail: "Spectranet, Smile and FiberOne", cta: "Top up internet", href: "/developers/api#disbursement", icon: Wifi },
      { name: "Gift card balances", detail: "Convert store credit into naira", cta: "Convert a balance", href: "/developers/api#treasury", icon: Gift },
    ],
  },
];

export function CoverageTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <>
    <div
      role="tablist"
      aria-label="Product coverage"
      className="mt-8 flex flex-wrap gap-2.5"
      onKeyDown={(e) =>
        roveTabs(e, TABS.length, TABS.findIndex((t) => t.id === active), (n) =>
          setActive(TABS[n].id),
        )
      }
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          id={`tab-${t.id}`}
          aria-selected={active === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={active === t.id ? 0 : -1}
          onClick={() => setActive(t.id)}
          className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            active === t.id
              ? "bg-brand text-white"
              : "border border-line bg-white text-ink hover:border-brand/40 hover:bg-brand-soft"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>

    <div
      role="tabpanel"
      id={`panel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5"
    >
      {tab.entries.map(({ name, detail, cta, href, icon: Icon }) => (
        <div key={name}>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="h-6 w-6" />
          </span>
          <h3 className="mt-5 font-bold">{name}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {detail}
          </p>
          <Link
            href={href}
            className="mt-2 inline-flex min-h-11 items-center text-[15px] font-semibold text-brand underline decoration-2 underline-offset-4 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {cta}
          </Link>
        </div>
      ))}
    </div>
    </>
  );
}

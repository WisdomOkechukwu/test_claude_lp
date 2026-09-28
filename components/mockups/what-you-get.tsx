"use client";

import { useState } from "react";
import {
  Bank,
  Check,
  ChevronDown,
  Code,
  LinkIcon,
  Repeat,
  Users,
} from "@/components/ui/icons";

const ITEMS = [
  {
    icon: Bank,
    title: "A platform to handle your business needs",
    detail: "One balance every deposit lands in, one dashboard, one API — collections, withdrawals, loans, bills and treasury on the same account rather than five vendors and five reconciliations.",
  },
  {
    icon: LinkIcon,
    title: "Every way to get paid, switched on",
    detail: "Payment links, NQR codes and bank transfer from day one. No terminal to rent, no separate merchant application per channel.",
  },
  {
    icon: Repeat,
    title: "Track loan payments",
    detail: "Every borrower has a profile: what they have paid, what is left, how many instalments remain and when the next one falls due. Miss one and the arrears alert reaches you that morning.",
  },
  {
    icon: Users,
    title: "A dashboard your whole team can use",
    detail: "Roles, approval limits and a full audit trail. Your accountant sees what they need, your intern cannot move a million naira.",
  },
  {
    icon: Code,
    title: "API keys and a sandbox",
    detail: "Test credentials, signed webhooks and the Tribe SDKs. Your engineers can be live on collections the same week.",
  },
];

export function WhatYouGet() {
  const [open, setOpen] = useState(0);

  return (
    <div className="w-full rounded-xl bg-white p-6 ring-1 ring-line sm:p-7">
      <div className="flex items-center gap-3">
        <h2 className="text-[15px] font-bold">What you get on day one</h2>
        <span className="ml-auto rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
          No setup fee
        </span>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {ITEMS.map(({ icon: Icon, title, detail }, i) => {
          const expanded = open === i;
          return (
            <li key={title}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? -1 : i)}
                  aria-expanded={expanded}
                  aria-controls={`wyg-panel-${i}`}
                  className="flex min-h-11 w-full items-center gap-3 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[14px] font-semibold">{title}</span>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>
              {/* Always rendered, hidden when collapsed: aria-controls used to
                  point at an element that only existed while the row was open,
                  which is a dangling reference for anything reading the row. */}
              <p
                id={`wyg-panel-${i}`}
                hidden={!expanded}
                className="pb-4 pl-12 pr-2 text-[14px] leading-relaxed text-muted"
              >
                {detail}
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-[13px] font-semibold">
        <Check className="h-4 w-4 shrink-0 text-brand" />
        Most businesses are live within 48 hours of sending their CAC documents
      </p>
    </div>
  );
}

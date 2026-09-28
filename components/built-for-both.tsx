"use client";

import { useState } from "react";
import { Button, TextLink } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { OperatorConsole } from "@/components/mockups/operator-console";
import { DeveloperConsole } from "@/components/mockups/developer-console";
import { PhoneShell, TerminalShell } from "@/components/mockups/device";
import { roveTabs } from "@/components/ui/tablist";
import { Check, Clock, Code, Receipt, Repeat, ShieldCheck, Users, Vault } from "@/components/ui/icons";

/* This section used to be two cards side by side — one white, one plum — each
   with a heading, a tick list, a console and two buttons. Eight competing
   elements across two columns, and on a phone it read as the same content
   twice.

   It is one argument, not two, so it is presented as one: a claim, a switch
   between the two audiences, and the evidence for whichever is selected. The
   consoles are the evidence and they now get the room they need rather than
   being squeezed into half a column. */
const SIDES = {
  operator: {
    label: "For the operator",
    heading: "Raise it, approve it, watch it leave",
    body: "Your finance lead should never have to open a terminal to answer “has it gone out yet”. Everything that moves money has a screen, an approver and a receipt.",
    points: [
      { icon: Users, title: "Roles and limits per person", body: "Viewing, raising and approving are three separate permissions. Your intern cannot move a million naira." },
      { icon: ShieldCheck, title: "Two approvers above your threshold", body: "Set the figure yourself. Above it a payout waits — including one raised by the API, which cannot approve its own request." },
      { icon: Receipt, title: "An audit trail you can export", body: "Who raised it, who approved it, from which device, and what changed. Append-only, and kept when a staff member leaves." },
      { icon: Clock, title: "Approve from a phone", body: "The queue is the same queue. No desktop-only screen holding up a payout because somebody is in a taxi." },
    ],
    cta: { label: "Create an account", href: "#how-it-works" },
    link: { label: "How access is controlled", href: "/security#access" },
  },
  engineer: {
    label: "For the engineer",
    heading: "Four calls, and the sandbox fails like production",
    body: "Create a user, take a deposit, send a withdrawal, verify the webhook. Everything else is optional — and every failure you will meet in production can be forced on demand before you ship.",
    points: [
      { icon: Code, title: "One REST API, both environments", body: "Going live is a key swap. Same paths, same payloads, no base URL to change and no flag to flip." },
      { icon: Repeat, title: "Idempotent by reference", body: "Send your own reference on every write. Repeat it and you get the original object back, never a second deposit." },
      { icon: ShieldCheck, title: "Signed webhooks, retried for 24 hours", body: "HMAC-SHA512 over the raw body. Assume duplicates and out-of-order delivery; key your handler on the event id." },
      { icon: Vault, title: "The SDK matches the reference", body: "Under every endpoint is the same call through the Tribe SDKs, initialisation included, in whichever language you pick." },
    ],
    cta: { label: "See how our API works", href: "/developers" },
    link: { label: "Read the API reference", href: "/developers/api" },
  },
} as const;

type Side = keyof typeof SIDES;
const SIDE_KEYS = Object.keys(SIDES) as Side[];

export function BuiltForBoth() {
  const [side, setSide] = useState<Side>("operator");
  const s = SIDES[side];

  return (
    <Band id="developers" className="bg-bone">
      <Container>
        <div className="max-w-[46ch]">
          <Eyebrow className="text-brand">One product, two front doors</Eyebrow>
          <h2 className="heading display-section">
            The same engine, whichever door you came in by
          </h2>
          <p className="mt-6 text-lg text-muted">
            Collections, settlement and the loan book sit behind both. Your
            operations lead never has to open a terminal, your engineers never
            have to open a dashboard, and neither of them is looking at a
            different set of numbers.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Which door"
          className="mt-10 inline-flex flex-wrap gap-1 rounded-full bg-white p-1 ring-1 ring-line"
          onKeyDown={(e) =>
            roveTabs(e, SIDE_KEYS.length, SIDE_KEYS.indexOf(side), (n) =>
              setSide(SIDE_KEYS[n]),
            )
          }
        >
          {SIDE_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={side === k}
              aria-controls={`door-${k}`}
              tabIndex={side === k ? 0 : -1}
              onClick={() => setSide(k)}
              className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                side === k ? "bg-brand text-white" : "text-muted hover:text-ink"
              }`}
            >
              {SIDES[k].label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`door-${side}`}
          className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16"
        >
          <div>
            <h3 className="heading max-w-[24ch] text-2xl">{s.heading}</h3>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-muted">
              {s.body}
            </p>

            <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {s.points.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <dt className="flex items-center gap-3 font-semibold">
                    <Icon className="h-5 w-5 shrink-0 text-brand" />
                    {title}
                  </dt>
                  <dd className="mt-1.5 max-w-[42ch] text-[15px] leading-relaxed text-muted">
                    {body}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href={s.cta.href} size="lg">
                {s.cta.label}
              </Button>
              <TextLink href={s.link.href}>{s.link.label}</TextLink>
            </div>
          </div>

          {/* The evidence, in the surface each audience actually uses it on.
              An approval queue on a phone is the claim the copy makes; a request
              in a terminal is the one beside it. A floating white card was
              neither. */}
          <div className="min-w-0">
            {side === "operator" ? (
              <PhoneShell>
                <div className="px-3 pb-4 pt-1">
                  <OperatorConsole className="border-0 p-1 ring-0" />
                </div>
              </PhoneShell>
            ) : (
              <TerminalShell title="tribe · sandbox">
                <DeveloperConsole className="rounded-none ring-0" />
              </TerminalShell>
            )}
            <p className="mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {side === "operator"
                ? "A real queue — pick a payout and the total moves with it. This is the screen, on the device it is used on."
                : "A real request — switch the language and send it to see the response come back."}
            </p>
          </div>
        </div>
      </Container>
    </Band>
  );
}

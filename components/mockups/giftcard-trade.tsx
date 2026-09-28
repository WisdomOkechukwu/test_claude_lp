"use client";

import { useEffect, useState } from "react";
import { Check } from "@/components/ui/icons";
import { GiftCardFace } from "@/components/art";
import { BRANDS, type BrandKey } from "@/components/brand-logos";
import { group, naira } from "./format";
import { FALLBACK_RATES, type Rate } from "@/lib/rates";
import { roveTabs } from "@/components/ui/tablist";

/* Accepting a gift card is a resale, so the operator sets what they keep. */
const MARGINS = {
  percent: { label: "Percentage" },
  flat: { label: "Flat fee" },
} as const;

type MarginKind = keyof typeof MARGINS;
const MARGIN_KEYS = Object.keys(MARGINS) as MarginKind[];

/* Rates come from `GET /api/rates`, which your backend pushes to. Until it
   does — and if the fetch fails — the fallback board in lib/rates.ts is what
   renders, which is the same four this mockup always showed.

   **The fetch happens after mount, never during render.** This component
   renders on the server and again on the client, and a value that differs
   between those two passes is a hydration error, which is the rule for this
   whole folder. So the first client render uses exactly the fallback the
   server used, and a live board replaces it on the next paint.

   Colours and marks come from brand-logos.tsx — the card renders the brand's
   own livery, so there is nothing to tint here. */
const CARDS: { key: BrandKey; region: string; rate: number }[] =
  FALLBACK_RATES.map((r) => ({ key: r.brand, region: r.region, rate: r.rate }));

const DENOMS = [25, 50, 100, 200] as const;

export function GiftcardTrade({
  margin: showMargin = false,
  className = "",
}: {
  /* Business side only — a customer selling a card sets no margin. */
  margin?: boolean;
  className?: string;
}) {
  const [card, setCard] = useState(0);
  const [denom, setDenom] = useState<number>(100);
  const [marginKind, setMarginKind] = useState<MarginKind>("percent");
  /* Kept as the typed string so "2." and "2.50" survive mid-edit — parsing to a
     number on every keystroke eats the decimal point as you type it. */
  const [margin, setMargin] = useState("2.5");

  /* The live board, once it arrives. Null until then, so `cards` below is the
     fallback for the server render and the first client render alike. */
  const [live, setLive] = useState<typeof CARDS | null>(null);
  const [liveAt, setLiveAt] = useState<string | null>(null);

  useEffect(() => {
    /* Aborted on unmount so a slow response cannot set state on a gone tree. */
    const ac = new AbortController();

    fetch("/api/rates", { signal: ac.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((board: { rates?: Rate[]; updated_at?: string | null } | null) => {
        if (!board?.rates?.length) return;
        setLive(board.rates.map((r) => ({ key: r.brand, region: r.region, rate: r.rate })));
        setLiveAt(board.updated_at ?? null);
      })
      .catch(() => {
        /* Offline, 500, or the route is not deployed. The fallback board is
           already on screen and is a perfectly good answer. */
      });

    return () => ac.abort();
  }, []);

  const cards = live ?? CARDS;

  const active = cards[card] ?? cards[0];
  const payout = active.rate * denom;
  /* The operator's cut comes off the gross; the customer is credited the rest.
     Clamped so a flat fee larger than the trade cannot credit a negative. */
  const marginValue = Number.parseFloat(margin) || 0;
  const yours = Math.min(
    payout,
    marginKind === "percent"
      ? Math.round((payout * marginValue) / 100)
      : Math.round(marginValue),
  );
  const credited = Math.max(0, payout - yours);

  return (
    <div
      className={`w-full max-w-[460px] rounded-xl bg-white p-6 ring-1 ring-line sm:p-7 ${className}`}
    >
      {/* The same drawn face the marquee uses, at the size the converter can
          give it. It scales its own contents from its width, so there is no
          base font size to set here. */}
      <GiftCardFace
        brandKey={active.key}
        denomination={`$${group(denom)}`}
        className="mb-5"
      />

      <div
        role="tablist"
        aria-label="Gift card brand"
        className="flex flex-wrap gap-1.5"
        onKeyDown={(e) => roveTabs(e, cards.length, card, setCard)}
      >
        {cards.map((c, i) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={card === i}
            tabIndex={card === i ? 0 : -1}
            onClick={() => setCard(i)}
            className={`min-h-11 basis-[calc(50%-0.1875rem)] rounded-full px-2 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-1 sm:basis-auto ${
              card === i
                ? "bg-brand text-white"
                : "bg-bone text-muted hover:bg-line"
            }`}
          >
            {BRANDS[c.key].name}
          </button>
        ))}
      </div>

      <fieldset className="mt-3">
        <legend className="sr-only">Gift card value in dollars</legend>
        <div className="flex flex-wrap gap-1.5">
          {DENOMS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDenom(d)}
              aria-pressed={denom === d}
              className={`min-h-11 flex-1 basis-[calc(25%-0.28125rem)] rounded-full border px-2 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                denom === d
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line text-muted hover:bg-bone"
              }`}
            >
              ${d}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Your margin, on your terms. A business accepting gift cards is
          reselling them, so the question is not "what does Tribe pay" but
          "what do I keep" — set it as a percentage or as a flat naira figure
          and the credited line moves with it. */}
      {showMargin && (
      <fieldset className="mt-5 rounded-2xl border border-line p-4">
        <legend className="px-1 text-[13px] font-semibold">Your margin</legend>

        <div
          role="tablist"
          aria-label="How your margin is charged"
          className="flex gap-1.5"
          onKeyDown={(e) =>
            roveTabs(e, MARGIN_KEYS.length, MARGIN_KEYS.indexOf(marginKind), (n) =>
              setMarginKind(MARGIN_KEYS[n]),
            )
          }
        >
          {MARGIN_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={marginKind === k}
              tabIndex={marginKind === k ? 0 : -1}
              onClick={() => {
                setMarginKind(k);
                setMargin(k === "percent" ? "2.5" : "500");
              }}
              className={`min-h-11 flex-1 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                marginKind === k
                  ? "bg-brand text-white"
                  : "bg-bone text-muted hover:bg-line"
              }`}
            >
              {MARGINS[k].label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line px-4 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
          {marginKind === "flat" && (
            <span className="shrink-0 text-lg font-semibold text-muted" aria-hidden="true">
              ₦
            </span>
          )}
          <input
            id="gc-margin"
            inputMode="decimal"
            value={margin}
            onChange={(e) => {
              /* Digits and at most one point, so 2.5 works and 2..5 does not. */
              const clean = e.target.value
                .replace(/[^\d.]/g, "")
                .replace(/(\..*)\./g, "$1")
                .slice(0, 8);
              const n = Number.parseFloat(clean);
              const cap = marginKind === "percent" ? 40 : 200_000;
              setMargin(Number.isFinite(n) && n > cap ? String(cap) : clean);
            }}
            aria-label={
              marginKind === "percent"
                ? "Your margin as a percentage"
                : "Your margin as a flat naira fee"
            }
            className="tnum min-h-11 w-full bg-transparent text-lg font-semibold outline-none"
          />
          {marginKind === "percent" && (
            <span className="shrink-0 text-lg font-semibold text-muted" aria-hidden="true">
              %
            </span>
          )}
        </div>
      </fieldset>
      )}

      <dl className="mt-5 space-y-2 text-[15px]" aria-live="polite">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <dt className="text-muted">Today&apos;s rate</dt>
          <dd className="tnum ml-auto font-semibold">
            {naira(active.rate)} / $
          </dd>
        </div>
        {showMargin && (
        <div className="flex flex-wrap items-baseline gap-x-3">
          <dt className="min-w-0 text-muted">
            Your margin
            <span className="ml-1 text-[13px]">
              · {marginKind === "percent" ? `${margin || 0}%` : naira(marginValue)}
            </span>
          </dt>
          <dd className="tnum ml-auto font-semibold text-brand">
            + {naira(yours)}
          </dd>
        </div>
        )}
        <div className="flex flex-wrap items-baseline gap-x-3">
          <dt className="text-muted">Tribe fee</dt>
          <dd className="ml-auto font-semibold">₦0</dd>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3 border-t border-line pt-2.5">
          <dt className="min-w-0 font-semibold">
            {marginValue > 0 ? "Customer is credited" : "Credited to your balance"}
          </dt>
          <dd className="tnum ml-auto text-xl font-bold">{naira(credited)}</dd>
        </div>
      </dl>

      {/* Says which board is on screen. A rate that silently falls back to a
          stale default is worse than one that admits it. */}
      <p className="mt-3 flex items-center gap-2 text-[12px] text-muted">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${live ? "bg-brand" : "bg-line"}`}
        />
        {live ? "Live board" : "Indicative board"}
        {liveAt && <span className="tnum">· updated {liveAt.slice(11, 16)}</span>}
      </p>

      <p className="mt-2 flex items-start gap-2 text-[13px] leading-relaxed text-muted">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        {showMargin
          ? "Rate locks the moment you confirm. Your margin is settled to you separately, on your normal schedule."
          : "Rate locks the moment you confirm the trade"}
      </p>

      <button
        type="button"
        className="mt-5 h-12 w-full rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Convert to naira
      </button>
    </div>
  );
}

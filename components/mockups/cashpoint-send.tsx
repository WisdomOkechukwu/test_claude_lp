"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, Clock, Copy, Share } from "@/components/ui/icons";
import { digits, group, naira } from "./format";
import { roveTabs } from "@/components/ui/tablist";

/* A cashpoint is a PIN, not an account.

   You set aside an amount, Tribe hands back twenty digits, and whoever you send
   those digits to redeems them for the money. It is cash in an envelope with a
   receipt — the recipient does not need to be anybody in particular when you
   create it, which is the whole point: you can send it to someone who has not
   opened Tribe yet, and it is still their money when they do.

   Both halves are here because a code is only half a product. Creating one and
   redeeming one are the two things anybody does with it.

   The generated PIN is derived from the amount, not random: these render on the
   server and again on the client, so anything random would be a hydration
   mismatch — the rule for this whole folder. */
const MODES = { create: "Create one", redeem: "Redeem one" } as const;
type Mode = keyof typeof MODES;
const MODE_KEYS = Object.keys(MODES) as Mode[];

/* Twenty digits from the amount, by a small fixed hash. Same amount, same code,
   every render. */
function mint(amount: number): string {
  let seed = (amount % 100_000) + 7;
  let out = "";
  while (out.length < 20) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    out += String(seed % 10);
  }
  return out;
}

/* 4821 0339 0771 2654 0182 — twenty digits are unreadable in one run. */
const spaced = (code: string) => (code.match(/.{1,4}/g) ?? []).join(" ");

/* The one code the redeem side accepts, and what is behind it. */
const VALID = {
  code: "72460518339027164805",
  amount: 25_000,
  from: "Ada O.",
  note: "Rent share",
};

type Stage = "idle" | "working" | "done";

export function CashpointSend() {
  const [mode, setMode] = useState<Mode>("create");
  const [amount, setAmount] = useState(25_000);
  const [entered, setEntered] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const code = mint(amount);
  const clean = entered.replace(/\D/g, "");
  const matches = clean === VALID.code;

  function run() {
    clearTimeout(timer.current);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setStage("done");
      return;
    }
    setStage("working");
    timer.current = setTimeout(() => setStage("done"), 800);
  }

  function pick(next: Mode) {
    clearTimeout(timer.current);
    setStage("idle");
    setMode(next);
  }

  return (
    <div className="w-full max-w-[420px] rounded-xl bg-white p-6 ring-1 ring-line sm:p-7">
      <div
        role="tablist"
        aria-label="Cashpoint"
        className="flex gap-1 rounded-full bg-bone p-1"
        onKeyDown={(e) =>
          roveTabs(e, MODE_KEYS.length, MODE_KEYS.indexOf(mode), (n) => pick(MODE_KEYS[n]))
        }
      >
        {MODE_KEYS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={mode === k}
            tabIndex={mode === k ? 0 : -1}
            onClick={() => pick(k)}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              mode === k ? "bg-white text-brand shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {k === "create" ? (
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            )}
            {MODES[k]}
          </button>
        ))}
      </div>

      {mode === "create" ? (
        <>
          <label className="mb-2 mt-5 block text-sm text-muted" htmlFor="cp-amount">
            Set aside
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-line px-4 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="shrink-0 text-2xl font-semibold text-muted" aria-hidden="true">
              ₦
            </span>
            <input
              id="cp-amount"
              inputMode="numeric"
              value={group(amount)}
              onChange={(e) => {
                setAmount(digits(e.target.value));
                setStage("idle");
              }}
              aria-label="Amount in naira"
              className="tnum min-h-12 w-full bg-transparent text-2xl font-semibold outline-none"
            />
          </div>

          <button
            type="button"
            onClick={run}
            disabled={amount <= 0 || stage === "working"}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {stage === "working"
              ? "Generating…"
              : stage === "done"
                ? "Generate another"
                : `Generate a ${naira(amount)} cashpoint`}
          </button>

          <div className="mt-4 min-h-[172px]" aria-live="polite">
            {stage === "done" && (
              <div className="rounded-2xl border border-line p-4">
                <p className="text-[13px] text-muted">Send these digits to anyone</p>
                <p className="tnum mt-1.5 break-all font-mono text-[19px] font-bold tracking-wide">
                  {spaced(code)}
                </p>

                <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[13px]">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-muted">Worth</dt>
                    <dd className="tnum ml-auto font-semibold">{naira(amount)}</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-muted">Held from your balance</dt>
                    <dd className="ml-auto font-semibold">Until redeemed</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-muted">If nobody redeems it</dt>
                    <dd className="ml-auto font-semibold">Back to you in 7 days</dd>
                  </div>
                </dl>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(code);
                      } catch {
                        /* Not a secure context — confirm anyway, it is on screen. */
                      }
                      setCopied(true);
                    }}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/20 text-[14px] font-semibold transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-brand" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy PIN
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <label className="mb-2 mt-5 block text-sm text-muted" htmlFor="cp-code">
            Enter the PIN you were sent
          </label>
          <div className="rounded-2xl border border-line px-4 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <input
              id="cp-code"
              inputMode="numeric"
              maxLength={24}
              placeholder={spaced(VALID.code)}
              value={spaced(clean)}
              onChange={(e) => {
                setEntered(e.target.value.replace(/\D/g, "").slice(0, 20));
                setStage("idle");
              }}
              aria-describedby="cp-found"
              className="tnum min-h-12 w-full bg-transparent font-mono text-[17px] font-semibold tracking-wide outline-none placeholder:text-muted/50"
            />
          </div>

          {/* Height reserved so resolving a PIN does not shift the button. */}
          <p
            id="cp-found"
            aria-live="polite"
            className="mt-2 flex min-h-[22px] flex-wrap items-center gap-x-2 text-[13px]"
          >
            {matches ? (
              <>
                <Check className="h-4 w-4 shrink-0 text-brand" />
                <span className="font-semibold">
                  {naira(VALID.amount)} from {VALID.from}
                </span>
                <span className="text-muted">· {VALID.note}</span>
              </>
            ) : clean.length === 20 ? (
              <span className="text-accent-ink">
                Already redeemed, expired, or not a Tribe cashpoint.
              </span>
            ) : (
              <span className="text-muted">
                {20 - clean.length} more {20 - clean.length === 1 ? "digit" : "digits"}
              </span>
            )}
          </p>

          <button
            type="button"
            onClick={run}
            disabled={!matches || stage === "working"}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {stage === "working"
              ? "Redeeming…"
              : stage === "done"
                ? "Redeemed"
                : matches
                  ? `Redeem ${naira(VALID.amount)}`
                  : "Enter a cashpoint"}
          </button>

          <div className="mt-4 min-h-[86px]" aria-live="polite">
            {stage === "done" && matches && (
              <div className="rounded-2xl bg-brand-soft p-4">
                <p className="flex items-center gap-2 text-[15px] font-bold text-brand">
                  <Check className="h-5 w-5 shrink-0" />
                  {naira(VALID.amount)} is in your balance
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-accent-ink">
                  A cashpoint can only be redeemed once. This one is closed now,
                  and {VALID.from} has the receipt.
                </p>
              </div>
            )}
          </div>

          <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-muted">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Try the PIN in the box above — it is the one worth {naira(VALID.amount)}.
          </p>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, LinkIcon, Share } from "@/components/ui/icons";
import { digits, group, naira } from "./format";
import { QrCode } from "./qr";
import { roveTabs } from "@/components/ui/tablist";

/* Taking a payment is a sequence, and the card used to present it as a form —
   amount, channel, fee, slug and two buttons all at once, which is a lot of
   surface for a reader who only wants to know what the customer ends up
   looking at.

   As three steps it reads the way the job runs: decide the amount, decide the
   rail, hand it over. Each step shows one thing and the summary of what came
   before, so nothing is lost by paging through it.

   One price on money in, whichever rail it arrives on. The cap is the part that
   matters: above ₦200,000 the percentage stops and the fee is flat. There is no
   card row because Tribe does not accept cards. */
const RATE = 0.01;
const CAP = 2000;
const FEE_NOTE = "1%, capped at ₦2,000";

const CHANNELS = {
  transfer: {
    label: "Bank transfer",
    blurb: "They open their bank app and send. Matched to this link the moment it lands.",
  },
  nqr: {
    label: "NQR",
    blurb: "They scan from any Nigerian bank app. Print it once and leave it on the counter.",
  },
} as const;

type Channel = keyof typeof CHANNELS;
const CHANNEL_KEYS = Object.keys(CHANNELS) as Channel[];

const feeOn = (amount: number) => Math.min(amount * RATE, CAP);

const STEPS = ["Amount", "How they pay", "Share it"] as const;

export function PaymentLinkBuilder() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(250_000);
  const [slug, setSlug] = useState("ada-designs");
  const [channel, setChannel] = useState<Channel>("transfer");
  const [copied, setCopied] = useState(false);

  const fee = feeOn(amount);
  const net = Math.max(0, amount - fee);
  const settlement = Math.min(net * 0.005, 1000);
  const url = `tribe.ng/pay/${slug || "your-business"}`;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
    } catch {
      /* Clipboard is unavailable outside a secure context — still confirm to
         the user that the button did something. */
    }
    setCopied(true);
  }

  return (
    <div className="w-full max-w-[420px] rounded-xl bg-white p-6 ring-1 ring-line sm:p-7">
      {/* The steps are a list, not a tablist: this is a sequence with a
          position, and every one of them is reachable by name. */}
      <ol className="flex items-center gap-1.5">
        {STEPS.map((label, i) => {
          const done = i < step;
          const here = i === step;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={here ? "step" : undefined}
                className="group flex min-h-11 min-w-0 flex-1 flex-col justify-center gap-1.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1 w-full rounded-full transition-colors ${
                    here || done ? "bg-brand" : "bg-line group-hover:bg-line/80"
                  }`}
                />
                <span
                  className={`truncate text-left text-[11px] font-semibold ${
                    here ? "text-brand" : "text-muted"
                  }`}
                >
                  <span className="sr-only">
                    Step {i + 1} of {STEPS.length}:{" "}
                  </span>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-5">
        {step === 0 && (
          <>
            <label className="mb-2 block text-sm text-muted" htmlFor="pl-amount">
              You&apos;re collecting
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-line px-4 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <input
                id="pl-amount"
                inputMode="numeric"
                value={group(amount)}
                onChange={(e) => setAmount(digits(e.target.value))}
                aria-label="Amount in naira"
                className="tnum min-h-12 w-full bg-transparent text-2xl font-semibold text-ink outline-none"
              />
              <span className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full bg-brand text-[11px] font-bold text-white"
                  aria-hidden="true"
                >
                  ₦
                </span>
                NGN
              </span>
            </div>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[14px]" aria-live="polite">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="min-w-0 text-muted">
                  Tribe fee
                  <span className="ml-1 text-[12px]">· {FEE_NOTE}</span>
                </dt>
                <dd className="tnum ml-auto font-semibold">− {naira(fee)}</dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="min-w-0 text-muted">
                  Settlement
                  <span className="ml-1 text-[12px]">· 0.5%, capped at ₦1,000</span>
                </dt>
                <dd className="tnum ml-auto font-semibold">− {naira(settlement)}</dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3 border-t border-line pt-2">
                <dt className="font-semibold">In your bank</dt>
                <dd className="tnum ml-auto text-lg font-bold">
                  {naira(Math.max(0, net - settlement))}
                </dd>
              </div>
            </dl>
          </>
        )}

        {step === 1 && (
          <>
            <p className="mb-2 text-sm text-muted">How they pay</p>
            <div
              role="tablist"
              aria-label="Payment channel"
              className="flex gap-1.5"
              onKeyDown={(e) =>
                roveTabs(e, CHANNEL_KEYS.length, CHANNEL_KEYS.indexOf(channel), (n) =>
                  setChannel(CHANNEL_KEYS[n]),
                )
              }
            >
              {CHANNEL_KEYS.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={channel === c}
                  tabIndex={channel === c ? 0 : -1}
                  onClick={() => setChannel(c)}
                  className={`min-h-11 flex-1 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    channel === c
                      ? "bg-brand text-white"
                      : "bg-bone text-muted hover:bg-line"
                  }`}
                >
                  {CHANNELS[c].label}
                </button>
              ))}
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              {CHANNELS[channel].blurb}
            </p>

            {/* What the payer is actually handed, which is the whole reason to
                pick a channel at all. */}
            <div className="mt-4 rounded-2xl border border-line p-4" aria-live="polite">
              <p className="mb-3 text-[13px] font-semibold">Your customer sees</p>
              {channel === "nqr" ? (
                <div className="flex items-center gap-4">
                  <QrCode
                    payload={`https://${url}`}
                    className="h-24 w-24 shrink-0 rounded-lg"
                  />
                  <p className="min-w-0 text-[13px] leading-relaxed text-muted">
                    The same code carries the link, so a customer whose bank has
                    no NQR can still tap through and pay by transfer.
                  </p>
                </div>
              ) : (
                <dl className="space-y-1.5 text-[13px]">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-muted">Bank</dt>
                    <dd className="ml-auto font-semibold">Providus Bank</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-muted">Account name</dt>
                    <dd className="ml-auto min-w-0 truncate font-semibold">
                      Tribe / {slug || "your-business"}
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-muted">Account number</dt>
                    <dd className="tnum ml-auto font-mono font-semibold">
                      9902 4471 08
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-muted">Amount</dt>
                    <dd className="tnum ml-auto font-semibold">{naira(amount)}</dd>
                  </div>
                </dl>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label className="mb-2 block text-sm text-muted" htmlFor="pl-slug">
              Your link
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-bone/70 px-4 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <LinkIcon className="h-5 w-5 shrink-0 text-brand" />
              <span className="shrink-0 text-[15px] text-muted">tribe.ng/pay/</span>
              <input
                id="pl-slug"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                aria-label="Link name"
                className="min-h-12 w-full min-w-0 bg-transparent font-semibold text-ink outline-none"
              />
            </div>

            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[13px]">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="text-muted">Collecting</dt>
                <dd className="tnum ml-auto font-semibold">{naira(amount)}</dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <dt className="text-muted">By</dt>
                <dd className="ml-auto font-semibold">{CHANNELS[channel].label}</dd>
              </div>
            </dl>

            <p className="mt-3 flex items-start gap-2 text-[13px] text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              Settles to GTBank ••4471 the next working day
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={copy}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/20 font-semibold transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-brand" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Share className="h-4 w-4" />
                Share
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => setStep((n) => Math.max(0, n - 1))}
          disabled={step === 0}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-muted transition-colors hover:bg-bone hover:text-ink disabled:invisible focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={() => setStep((n) => Math.min(STEPS.length - 1, n + 1))}
            className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {step === 0 ? "Pick a rail" : "Get the link"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

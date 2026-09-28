"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { Bolt, Check, Close, Phone, Plus, Repeat, Tv, Wifi } from "@/components/ui/icons";
import { group, naira } from "./format";
import { roveTabs } from "@/components/ui/tablist";

/* A bulk run, built the way one is actually built.

   The first version of this took a CSV, which is how an accountant imagines the
   job and not how anybody does it: you pick who you are paying, pick the bundle
   they get, and add the numbers. A file upload on a marketing page is also a
   demo nobody can try.

   Outcomes are fixed rather than random — these render on the server and again
   on the client, so a random failure would be a hydration mismatch. The line
   that fails is chosen by position, not by chance. */
const PROVIDERS = {
  mtn: {
    logo: "/img/billers/mtn.png",
    label: "MTN",
    icon: Phone,
    brand: "#FFCC00",
    ink: true,
    field: "Phone number",
    placeholder: "0803 000 0000",
    unit: "lines",
    bundles: [
      { id: "air500", label: "₦500 airtime", amount: 500 },
      { id: "air2k", label: "₦2,000 airtime", amount: 2_000 },
      { id: "data15", label: "1.5GB · 30 days", amount: 1_000 },
      { id: "data10", label: "10GB · 30 days", amount: 4_500 },
    ],
  },
  glo: {
    logo: "/img/billers/glo.png",
    label: "Glo",
    icon: Wifi,
    brand: "#50B848",
    ink: true,
    field: "Phone number",
    placeholder: "0805 000 0000",
    unit: "lines",
    bundles: [
      { id: "g-air1k", label: "₦1,000 airtime", amount: 1_000 },
      { id: "g-data2", label: "2.9GB · 30 days", amount: 1_000 },
      { id: "g-data7", label: "7.7GB · 30 days", amount: 2_500 },
    ],
  },
  phed: {
    logo: "/img/billers/phed.png",
    label: "PHED",
    icon: Bolt,
    brand: "#0B4F9E",
    ink: false,
    field: "Meter number",
    placeholder: "4512 8890 11",
    unit: "meters",
    bundles: [
      { id: "p-15k", label: "₦15,000 prepaid", amount: 15_000 },
      { id: "p-45k", label: "₦45,000 prepaid", amount: 45_000 },
    ],
  },
  dstv: {
    logo: "/img/billers/dstv.jpg",
    label: "DStv",
    icon: Tv,
    brand: "#0C2E82",
    ink: false,
    field: "IUC number",
    placeholder: "7025 4418 90",
    unit: "decoders",
    bundles: [
      { id: "d-compact", label: "Compact · 1 month", amount: 12_500 },
      { id: "d-premium", label: "Premium · 1 month", amount: 44_500 },
    ],
  },
} as const;

type ProviderKey = keyof typeof PROVIDERS;
const PROVIDER_KEYS = Object.keys(PROVIDERS) as ProviderKey[];

/* Pre-loaded so the card says something before anyone types. */
const SEEDED = ["0803 412 7781", "0803 990 2245", "0806 771 0038"];

type Line = { id: string; to: string; bundle: string };

let seq = 0;
const nextId = () => `ln-${++seq}`;

export function BulkRun() {
  const [provider, setProvider] = useState<ProviderKey>("mtn");
  const [bundle, setBundle] = useState<string>(PROVIDERS.mtn.bundles[0].id);
  const [lines, setLines] = useState<Line[]>(() =>
    SEEDED.map((to) => ({ id: nextId(), to, bundle: PROVIDERS.mtn.bundles[0].id })),
  );
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const p = PROVIDERS[provider];

  useEffect(() => () => clearTimeout(timer.current), []);

  const total = lines.reduce((sum, l) => {
    const b = p.bundles.find((x) => x.id === l.bundle);
    return sum + (b?.amount ?? 0);
  }, 0);

  /* The third line fails, every time — enough to show a refund without
     pretending a run is mostly broken. */
  const failedAt = lines.length >= 3 ? 2 : -1;
  const failedLine = sent && failedAt >= 0 ? lines[failedAt] : null;
  const refunded = failedLine
    ? (p.bundles.find((x) => x.id === failedLine.bundle)?.amount ?? 0)
    : 0;

  function pickProvider(next: ProviderKey) {
    clearTimeout(timer.current);
    setSent(false);
    setRunning(false);
    setProvider(next);
    setBundle(PROVIDERS[next].bundles[0].id);
    setLines([]);
    setDraft("");
  }

  function add() {
    const to = draft.trim();
    if (!to) return;
    setLines((l) => [...l, { id: nextId(), to, bundle }]);
    setDraft("");
    setSent(false);
    inputRef.current?.focus();
  }

  function send() {
    clearTimeout(timer.current);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setSent(true);
      return;
    }
    setRunning(true);
    timer.current = setTimeout(() => {
      setRunning(false);
      setSent(true);
    }, 900);
  }

  return (
    <div className="w-full max-w-[460px] rounded-xl bg-white p-6 ring-1 ring-line sm:p-7">
      <h3 className="text-[15px] font-bold">Build a run</h3>

      <div
        role="tablist"
        aria-label="Who you are paying"
        className="mt-4 flex flex-wrap gap-1.5"
        onKeyDown={(e) =>
          roveTabs(e, PROVIDER_KEYS.length, PROVIDER_KEYS.indexOf(provider), (n) =>
            pickProvider(PROVIDER_KEYS[n]),
          )
        }
      >
        {PROVIDER_KEYS.map((k) => {
          const on = provider === k;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => pickProvider(k)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                on ? "bg-brand text-white" : "bg-bone text-muted hover:bg-line"
              }`}
            >
              <Image
                src={PROVIDERS[k].logo}
                alt=""
                width={200}
                height={200}
                sizes="24px"
                className="h-6 w-6 shrink-0 rounded object-cover"
              />
              {PROVIDERS[k].label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 mb-2 text-sm text-muted">Pick the bundle</p>
      <div className="flex flex-wrap gap-1.5">
        {p.bundles.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-pressed={bundle === b.id}
            onClick={() => {
              setBundle(b.id);
              setSent(false);
            }}
            className={`inline-flex min-h-11 items-center rounded-full border px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              bundle === b.id
                ? "border-brand bg-brand-soft text-brand"
                : "border-line text-muted hover:bg-bone"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <label className="mb-2 mt-4 block text-sm text-muted" htmlFor="bulk-to">
        {p.field}
      </label>
      <div className="flex gap-2">
        <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-line px-4 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
          <input
            ref={inputRef}
            id="bulk-to"
            inputMode="numeric"
            value={draft}
            placeholder={p.placeholder}
            onChange={(e) => setDraft(e.target.value.replace(/[^\d ]/g, "").slice(0, 16))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            className="tnum min-h-12 w-full bg-transparent font-mono text-[15px] font-semibold outline-none placeholder:font-sans placeholder:text-muted/60"
          />
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          aria-label={`Add this ${p.field.toLowerCase()} to the run`}
          className="grid min-h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white transition-colors hover:bg-brand-deep disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 border-t border-line pt-3" aria-live="polite">
        <p className="flex flex-wrap items-baseline gap-x-3 text-[13px]">
          <span className="font-semibold">
            {lines.length} {lines.length === 1 ? p.unit.replace(/s$/, "") : p.unit}
          </span>
          <span className="tnum ml-auto text-lg font-bold">{naira(total)}</span>
        </p>

        {lines.length > 0 ? (
          <ul className="mt-2 max-h-[176px] divide-y divide-line overflow-y-auto">
            {lines.map((l, i) => {
              const b = p.bundles.find((x) => x.id === l.bundle);
              const failed = sent && i === failedAt;
              return (
                <li key={l.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
                  <span className="tnum min-w-0 font-mono text-[13px] font-semibold">
                    {l.to}
                  </span>
                  <span className="min-w-0 text-[12px] text-muted">{b?.label}</span>
                  {sent ? (
                    <span
                      className={`ml-auto inline-flex shrink-0 items-center gap-1.5 text-[12px] font-bold ${
                        failed ? "text-accent-ink" : "text-brand"
                      }`}
                    >
                      {failed ? (
                        <>
                          <Close className="h-3.5 w-3.5" />
                          Refunded
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Paid
                        </>
                      )}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}
                      aria-label={`Remove ${l.to} from the run`}
                      className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-bone hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <Close className="h-4 w-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 rounded-xl bg-bone px-4 py-6 text-center text-[13px] text-muted">
            Add a {p.field.toLowerCase()} above. Up to 5,000 in one run.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={send}
        disabled={lines.length === 0 || running}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {running ? (
          <>
            <Repeat className="h-4 w-4 animate-spin-slow" />
            Sending {group(lines.length)}…
          </>
        ) : sent ? (
          "Send another run"
        ) : (
          `Send ${group(lines.length)} ${lines.length === 1 ? p.unit.replace(/s$/, "") : p.unit} · ${naira(total)}`
        )}
      </button>

      <p className="mt-3 min-h-[36px] text-[12px] leading-relaxed text-muted" aria-live="polite">
        {sent
          ? failedLine
            ? `${lines.length - 1} paid, 1 refunded — ${failedLine.to} is not on the ${p.label} network, and its ${naira(refunded)} is back in your balance. One receipt covers the run.`
            : "Every line paid. One receipt for the run, one entry per line for your books."
          : `Charged once the run completes. A line that cannot be paid refunds itself rather than leaving the run half done.`}
      </p>
    </div>
  );
}

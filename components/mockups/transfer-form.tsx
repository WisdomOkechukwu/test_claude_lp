"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Clock } from "@/components/ui/icons";
import { digits, group, naira } from "./format";
import { Select } from "@/components/ui/select";

const BANKS = [ "GTBank", "Zenith Bank", "Access Bank", "UBA", "First Bank", "Kuda", "Moniepoint", "Opay", "PalmPay",
] as const;

/* Name resolution is derived from the digits rather than randomised, so the
   same account number always resolves to the same person — on the server and
   on the client. */
const NAMES = [ "CHINEDU OKAFOR", "AMAKA BALOGUN", "TOBI ADEYEMI", "HAUWA SULEIMAN", "IFEANYI NWOSU", "FUNMI ADEBAYO",
] as const;

function resolveName(account: string) {
  if (account.length < 10) return null;
  const sum = [...account].reduce((n, c) => n + Number(c), 0);
  return NAMES[sum % NAMES.length];
}

export function TransferForm() {
  const [bank, setBank] = useState(0);
  const [account, setAccount] = useState("0123456789");
  const [amount, setAmount] = useState(25_000);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const name = resolveName(account);
  const ready = Boolean(name) && amount > 0;

  function send() {
    if (!ready) return;
    clearTimeout(timer.current);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setSent(true);
      return;
    }

    setSending(true);
    setSent(false);
    timer.current = setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  }

  return (
    <div className="w-full max-w-[420px] rounded-xl bg-white p-6 ring-1 ring-line sm:p-7">
      <h3 className="text-[15px] font-bold">Send money</h3>

      <label htmlFor="tf-bank" className="mt-5 mb-2 block text-sm text-muted">
        To which bank?
      </label>
      <Select
        id="tf-bank"
        label="Recipient's bank"
        value={String(bank)}
        onChange={(v) => setBank(Number(v))}
        options={BANKS.map((b, i) => ({ value: String(i), label: b }))}
      />

      <label htmlFor="tf-acct" className="mt-4 mb-2 block text-sm text-muted">
        Account number
      </label>
      <input
        id="tf-acct"
        inputMode="numeric"
        value={account}
        maxLength={10}
        onChange={(e) => {
          setAccount(e.target.value.replace(/\D/g, "").slice(0, 10));
          setSent(false);
        }}
        className="tnum w-full rounded-2xl border border-line px-4 py-3 text-lg font-semibold outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />

      <p className="mt-2 min-h-[22px] text-[13px]" aria-live="polite">
        {name ? (
          <span className="flex items-center gap-1.5 font-semibold text-brand">
            <Check className="h-4 w-4" />
            {name}
          </span>
        ) : (
          <span className="text-muted">
            Enter all 10 digits to confirm the name
          </span>
        )}
      </p>

      <label htmlFor="tf-amount" className="mt-3 mb-2 block text-sm text-muted">
        How much?
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-line px-4 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <input
          id="tf-amount"
          inputMode="numeric"
          value={group(amount)}
          onChange={(e) => {
            setAmount(digits(e.target.value));
            setSent(false);
          }}
          aria-label="Amount in naira"
          className="tnum min-h-12 w-full bg-transparent text-2xl font-semibold outline-none"
        />
        <span className="shrink-0 text-sm font-semibold text-muted">NGN</span>
      </div>

      <dl className="my-4 space-y-2 border-y border-line py-3 text-[15px]">
        <div className="flex items-baseline">
          <dt className="text-muted">Transfer fee</dt>
          <dd className="ml-auto font-semibold text-brand">₦0</dd>
        </div>
        <div className="flex items-baseline">
          <dt className="text-muted">They receive</dt>
          <dd className="tnum ml-auto text-lg font-bold">{naira(amount)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={send}
        disabled={!ready}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {sending ? "Sending…" : sent ? "Send again" : "Send now"}
      </button>

      <p className="mt-3 flex items-center justify-center gap-2 text-[13px]" aria-live="polite">
        {sent ? (
          <span className="flex items-center gap-1.5 font-semibold text-brand">
            <Check className="h-4 w-4" />
            Sent · landed in 4 seconds
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-muted">
            <Clock className="h-4 w-4 text-brand" />
            Arrives in seconds on NIP, any hour
          </span>
        )}
      </p>
    </div>
  );
}

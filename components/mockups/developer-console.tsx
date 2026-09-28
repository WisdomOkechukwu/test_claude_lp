"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Code } from "@/components/ui/icons";
import { highlight } from "@/components/developers/code-block";
import { roveTabs } from "@/components/ui/tablist";

const SAMPLES = {
  curl: {
    label: "cURL",
    code: `curl https://api.tribe.ng/v1/settlements \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d amount=2480000 \\
  -d bank_code=058 \\
  -d account_number=0123456789 \\
  -d cadence=instant`,
  },
  node: {
    label: "Node",
    code: `import { Tribe } from "@tribe/node";

const tribe = new Tribe(process.env.TRIBE_SECRET_KEY);

const payout = await tribe.settlements.create({
  amount: 2_480_000,
  bank_code: "058",
  account_number: "0123456789",
  cadence: "instant",
});`,
  },
  python: {
    label: "Python",
    code: `import tribe

tribe.api_key = os.environ["TRIBE_SECRET_KEY"]

payout = tribe.Settlement.create(
    amount=2480000,
    bank_code="058",
    account_number="0123456789",
    cadence="instant",
)`,
  },
} as const;

type Lang = keyof typeof SAMPLES;

const RESPONSE = `{ "id": "stl_3k9xQm2", "status": "queued", "amount": 2480000, "currency": "NGN", "bank": "GTBank", "rail": "NIP", "expected_at": "2026-09-25T14:32:10+01:00"
}`;

export function DeveloperConsole({ className = "" }: { className?: string }) {
  const [lang, setLang] = useState<Lang>("node");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function send() {
    clearTimeout(timer.current);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setSent(true);
      return;
    }

    setPending(true);
    setSent(false);
    timer.current = setTimeout(() => {
      setPending(false);
      setSent(true);
    }, 650);
  }

  return (
    <div className={`w-full min-w-0 overflow-hidden rounded-xl bg-plum text-white ring-1 ring-line ${className}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/10 px-5 py-3">
        <Code className="h-4 w-4 shrink-0 text-accent" />
        <span className="font-mono text-[12px] text-white/70">
          POST /v1/settlements
        </span>
        <div
          role="tablist"
          aria-label="Language"
          className="flex gap-1 min-[420px]:ml-auto"
          onKeyDown={(e) => {
            const langs = Object.keys(SAMPLES) as Lang[];
            roveTabs(e, langs.length, langs.indexOf(lang), (n) =>
              setLang(langs[n]),
            );
          }}
        >
          {(Object.keys(SAMPLES) as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              tabIndex={lang === l ? 0 : -1}
              onClick={() => setLang(l)}
              className={`inline-flex min-h-11 items-center rounded-full px-3 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                lang === l
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white"
              }`}
            >
              {SAMPLES[l].label}
            </button>
          ))}
        </div>
      </div>

      {/* `scroll-edge` fades the right edge while there is more to scroll to,
          and stops as soon as there isn't. Without it the cURL line just looks
          truncated on a touch device, where the overlay scrollbar is invisible
          at rest. */}
      <pre className="scroll-edge overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-relaxed text-white/85">
        <code>{highlight(SAMPLES[lang].code)}</code>
      </pre>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 px-5 py-3">
        <button
          type="button"
          onClick={send}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-[13px] font-semibold text-ink transition-colors hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {pending ? "Sending…" : "Send request"}
        </button>
        {sent && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-accent">
            <Check className="h-3.5 w-3.5" />
            201 Created · 340ms
          </span>
        )}
      </div>

      {sent && (
        <pre
          aria-live="polite"
          className="scroll-edge overflow-x-auto border-t border-white/10 bg-[#170226] px-5 py-4 font-mono text-[12.5px] leading-relaxed text-white/85 [--edge-bg:#170226]"
        >
          <code>{highlight(RESPONSE)}</code>
        </pre>
      )}
    </div>
  );
}

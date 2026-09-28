"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { KIND_LABEL, search } from "@/components/developers/search-index";

/* Search across the whole API surface, phrased however the reader phrases it.

   It is a ranked keyword search with the query widened first, not a model —
   "how do I know a payout failed" becomes `withdrawal settlement error failed
   returned` before anything is matched, which is what lets it reach
   `withdrawal.returned` and `422 rail_rejected` even though the question shares
   no word with either. The expansion table lives in search-index.ts.

   Everything runs locally against an index built from the same data the pages
   render. No request, no key, and it works with the tab offline.

   The field in the page is a *trigger*, not the input. Opening into an overlay
   is what lets the suggestions and the results have room: inline, a dropdown
   over the hero either covered the page it was searching or ran out of height
   on a phone. The overlay is a dialog — scrim, Escape, focus returned to the
   trigger — and the list inside it is a combobox listbox the arrow keys walk,
   because a result list you can only reach with a mouse is the thing people
   complain about in docs search. */
const SUGGESTIONS = [
  "how do I pay someone",
  "my payout has not arrived",
  "take money by QR",
  "borrower missed a repayment",
  "send between two users",
  "customer paid twice",
];

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* ⌘K and / open it from anywhere on the page, the way every docs site a
     developer already uses does. `/` is ignored while something is typed in. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.isContentEditable);

      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    /* Focus goes back where it came from, or a keyboard user is dumped at the
       top of the document every time they close the panel. */
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 text-left transition-colors hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
        <span className="min-w-0 flex-1 truncate text-[15px] text-muted">
          Ask in your own words…
        </span>
        <kbd
          aria-hidden="true"
          className="hidden shrink-0 rounded-md border border-line px-2 py-1 font-mono text-[11px] font-semibold text-muted sm:block"
        >
          /
        </kbd>
      </button>

      {open && <SearchOverlay onClose={close} />}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  /* Derived, not stored. Holding results in state and filling them from an
     effect renders once with the previous query's results before correcting
     itself — and `react-hooks/set-state-in-effect` rightly rejects it. */
  const results = useMemo(() => search(query), [query]);
  const showing = query.trim().length > 0;

  /* Reset the highlight when the query changes, as a render-time adjustment
     rather than an effect, for the same reason. */
  const [queryAtReset, setQueryAtReset] = useState(query);
  if (query !== queryAtReset) {
    setQueryAtReset(query);
    setActive(0);
  }

  useEffect(() => {
    inputRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const move = (delta: number) => {
    if (!results.length) return;
    setActive((a) => (a + delta + results.length) % results.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the documentation"
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pb-8 pt-[10vh] sm:pt-[14vh]"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      {/* Translucent rather than opaque: the page stays legible behind it, so
          the overlay reads as something laid over the docs rather than as a
          separate screen you have navigated to. */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 -z-10 cursor-default bg-plum/40 backdrop-blur-sm"
      />

      <div className="flex max-h-full w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-white/95 shadow-[0_24px_60px_-20px_rgba(30,4,51,0.45)] ring-1 ring-line backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showing}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              showing && results[active] ? `${listId}-${active}` : undefined
            }
            aria-label="Search the documentation"
            placeholder="“my payout has not arrived”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                move(1);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                move(-1);
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                window.location.assign(results[active].href);
              }
            }}
            className="min-h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-bone hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!showing ? (
            <div className="p-4">
              <p className="px-1 pb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
                Try asking
              </p>
              <ul className="space-y-1">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(s);
                        inputRef.current?.focus();
                      }}
                      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] text-ink transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
                      <span className="min-w-0 truncate">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Search results" className="p-2">
              {results.map((r, i) => (
                <li key={`${r.kind}-${r.title}`} role="none">
                  <Link
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={r.href}
                    onMouseEnter={() => setActive(i)}
                    onClick={onClose}
                    className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${
                      i === active ? "bg-brand-soft" : ""
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 rounded-full bg-bone px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                      {KIND_LABEL[r.kind]}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold text-ink">
                        {r.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                        {r.detail}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-[14px] leading-relaxed text-muted">
              Nothing matched that. Try the words you would use out loud —
              &ldquo;send money to a customer&rdquo;, &ldquo;payment
              failed&rdquo;, &ldquo;which bank code&rdquo;.
            </p>
          )}
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-2.5 text-[12px] text-muted">
          <span>
            <Key>↑</Key> <Key>↓</Key> to move
          </span>
          <span>
            <Key>↵</Key> to open
          </span>
          <span>
            <Key>esc</Key> to close
          </span>
          <span className="ml-auto hidden sm:block">
            {showing ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Searches every endpoint, event and error"}
          </span>
        </p>
      </div>
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-bone px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink">
      {children}
    </kbd>
  );
}

/* Two icons that exist only here, so they live here rather than bloating the
   shared set. Same 24-unit stroke grid as components/ui/icons.tsx. */
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

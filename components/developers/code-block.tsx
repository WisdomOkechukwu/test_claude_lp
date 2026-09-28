import type { ReactNode } from "react";
import { CopyButton } from "@/components/developers/copy-button";

/* Quoted strings and bare numbers are the only tokens worth tinting —
   anything more would need a real parser for four different languages, and
   this is documentation, not an editor.

   Lifted out of `mockups/developer-console.tsx`, which now imports it, so the
   samples in the docs and the sample in the home page demo tint identically.

   The two colours are chosen against the plum background rather than picked by
   eye: #ffb38a is 8.6:1 on #1e0433 and #c9a6f0 is 7.4:1, both well clear of
   the 4.5:1 floor for code you are expected to read. */
export function highlight(code: string): ReactNode[] {
  return code
    .split(/("(?:[^"\\]|\\.)*"|\b\d[\d_]*\b)/g)
    .map((part, i) => {
      if (part.startsWith('"'))
        return (
          <span key={i} className="text-[#ffb38a]">
            {part}
          </span>
        );
      if (/^\d/.test(part))
        return (
          <span key={i} className="text-[#c9a6f0]">
            {part}
          </span>
        );
      return <span key={i}>{part}</span>;
    });
}

/* A server-rendered sample with one client control in its header.

   This file used to say the docs ship no JavaScript at all. That held while
   every sample was read-only; it stopped holding once the reference carried
   webhook payloads and error bodies people are meant to paste into a handler.
   `CopyButton` is its own client component, so what hydrates is the button —
   not the reference page around it. The interactive multi-language console on
   the home page still stays where it is. */
export function CodeBlock({
  code,
  label,
  copyLabel,
  copyable = true,
  className = "",
}: {
  code: string;
  /* Shown in the header strip — usually a method and path, or a filename. */
  label?: string;
  /* Accessible name for the copy control, where "Copy" alone would be
     ambiguous on a page with a dozen of them. */
  copyLabel?: string;
  copyable?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-plum text-white ring-1 ring-line ${className}`}
    >
      {(label || copyable) && (
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-2">
          {label && (
            <p className="min-w-0 truncate font-mono text-[12px] text-white/70">
              {label}
            </p>
          )}
          {copyable && (
            <span className="ml-auto">
              <CopyButton text={code} label={copyLabel ?? (label ? `Copy ${label}` : "Copy")} />
            </span>
          )}
        </div>
      )}
      {/* overflow-x-auto rather than wrapping: a broken cURL line is worse to
          read than a scrollbar, and the page must never scroll sideways.
          `scroll-edge` fades the right edge while there is more to come, so a
          touch device — where the overlay scrollbar is invisible until you
          drag — does not read a scrollable line as a truncated one. */}
      <pre className="scroll-edge overflow-x-auto px-5 py-4 font-mono text-[12.5px] leading-relaxed">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}

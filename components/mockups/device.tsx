import type { ReactNode } from "react";

/* Two shells, so a demo sits in the surface the person actually uses it on.

   An approval queue shown as a floating white card is an abstraction; shown on
   a phone it is the thing a finance lead does in a taxi, which is exactly what
   the copy beside it claims. A request and its response belong in a terminal
   for the same reason. The frame is doing argumentative work, not decoration.

   Both are `aria-hidden` chrome around real, focusable content — the frame adds
   nothing to read, so it should add nothing to the accessibility tree either. */

export function PhoneShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[340px] rounded-[2.4rem] border-[9px] border-ink bg-ink shadow-[0_24px_60px_-24px_rgba(30,4,51,0.5)] ${className}`}
    >
      {/* The cut-out. Decorative, and sized off the frame so it scales with it. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink"
      />
      <div className="overflow-hidden rounded-[1.7rem] bg-white">
        <div
          aria-hidden="true"
          className="flex items-center justify-between px-5 pb-1 pt-3.5 text-[11px] font-semibold"
        >
          <span className="tnum">9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink" />
            <span className="inline-block h-2.5 w-5 rounded-[3px] border border-ink" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function TerminalShell({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-plum shadow-[0_24px_60px_-24px_rgba(30,4,51,0.5)] ring-1 ring-line ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5"
      >
        <span className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        </span>
        <span className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-white/50">
          {title}
        </span>
        <span className="w-[42px] shrink-0" />
      </div>
      {children}
    </div>
  );
}

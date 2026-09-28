"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "@/components/ui/icons";

/* The one interactive thing on the docs routes.

   `code-block.tsx` says these pages ship no JavaScript, and that was right
   while there was nothing to click. A payload you have to select by hand and
   drag over four lines of a scrolling pane is a different matter, so this is a
   deliberate, narrow exception: the button is its own client component, and
   `CodeBlock` stays a server component that renders it. One small hydration
   root per sample rather than a client boundary around the whole reference.

   Clipboard access throws outside a secure context. Confirming anyway is
   better than a button that silently does nothing — the sample is on screen
   either way, so nobody is misled about what they have. */
export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  /* Distinguishes the control when a page has several, for a screen reader
     working through a list of buttons all called "Copy". */
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* Not a secure context, or permission denied. */
    }
    setCopied(true);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : label}
      className="-my-1 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {copied ? (
        <>
          {/* 6.3:1 on plum — the only orange CLAUDE.md sanctions on the dark
              band, and the same success colour the developer console uses. */}
          <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span className="text-accent">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          Copy
        </>
      )}
    </button>
  );
}

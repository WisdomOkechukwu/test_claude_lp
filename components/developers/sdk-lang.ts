"use client";

import { useSyncExternalStore } from "react";
import { SDK_LANGS, type SdkLang } from "@/components/developers/sdk-samples";

/* One SDK language for the whole reference page.

   The alternative was per-endpoint state, which means picking Go twenty times
   as you scroll. A module-level store with useSyncExternalStore gives every
   endpoint block the same answer and re-renders all of them on a change —
   the same pattern ui/get-app-button.tsx already uses for platform detection,
   and for the same reason: a value that is shared, external to React, and must
   not differ between the server render and the first client one.

   The server snapshot is always the first language, so the prerendered HTML and
   the first client render agree; a stored preference is applied after
   hydration, which is a paint, not a mismatch. */
const KEY = "tribe:sdk-lang";

let current: SdkLang = SDK_LANGS[0];
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): SdkLang {
  try {
    const v = window.localStorage.getItem(KEY);
    return (SDK_LANGS as readonly string[]).includes(v ?? "") ? (v as SdkLang) : SDK_LANGS[0];
  } catch {
    /* Storage can be disabled outright; the default is a fine answer. */
    return SDK_LANGS[0];
  }
}

function subscribe(listener: () => void): () => void {
  /* First subscriber pulls the stored preference in. Doing it here rather than
     at module scope keeps this file importable on the server. */
  if (!hydrated) {
    hydrated = true;
    const stored = readStored();
    if (stored !== current) current = stored;
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSdkLang(lang: SdkLang): void {
  if (lang === current) return;
  current = lang;
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    /* Not being able to remember the choice is not a reason to refuse it. */
  }
  for (const listener of listeners) listener();
}

export function useSdkLang(): SdkLang {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => SDK_LANGS[0],
  );
}

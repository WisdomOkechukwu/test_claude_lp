"use client";

import { useSyncExternalStore } from "react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { APP_STORE, PLAY_STORE, prefersAppStore } from "@/components/ui/app-links";

/* A Button that sends Apple platforms to the App Store and everyone else to
   Google Play.

   These pages are statically prerendered, so a render-time `navigator` check
   would produce one href on the server and another on the client — a
   hydration mismatch. `useSyncExternalStore` is the API for exactly this: it
   takes a separate server snapshot, so the HTML and the first client render
   both say Play, and React swaps in the real answer straight after hydration.
   (An effect calling setState would also work, but `react-hooks` rightly
   flags that as a render-then-correct pattern.)

   The subscribe callback is a no-op because the platform cannot change while
   the page is open.

   Doing it on the href rather than in an onClick keeps it a real link, so
   middle-click, copy-link and open-in-new-tab all give the right store once
   the page has hydrated. Before hydration the link still works; it just goes
   to Play. */
/* The same resolution, exposed on its own so a plain text link in the nav can
   use it without wearing a button's styling. */
export function useAppStoreHref(): string {
  return useSyncExternalStore(
    () => () => {},
    () => (prefersAppStore() ? APP_STORE : PLAY_STORE),
    () => PLAY_STORE,
  );
}

export function GetAppButton(props: Omit<ComponentProps<typeof Button>, "href">) {
  const href = useAppStoreHref();

  /* href last, deliberately: spreading props over it would let a stray
     href="#" from a call site silently win and send everyone nowhere. */
  return <Button {...props} href={href} />;
}

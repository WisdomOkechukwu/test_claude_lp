/* Where the "get the app" calls to action point.

   Placeholders. Tribe is a demo brand with no listing, so these go to the
   stores themselves rather than to a fabricated app id, which would 404 and
   read as a broken link. Swap both for the real listing URLs at launch. */
export const APP_STORE = "https://apps.apple.com/";
export const PLAY_STORE = "https://play.google.com/store/apps";

/* True on the platforms whose app comes from the App Store.

   iPadOS 13 and later report themselves as `Macintosh` in desktop mode, which
   normally forces a `maxTouchPoints` check to tell an iPad from a Mac. That
   check is not needed here: macOS goes to the App Store as well, so both
   answers lead to the same place.

   Only ever call this from an effect. Branching on it during render would give
   the server and the client different markup, which is the hydration bug the
   mockups elsewhere in this project are careful to avoid. */
export function prefersAppStore(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent);
}

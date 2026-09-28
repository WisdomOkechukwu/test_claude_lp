import type { KeyboardEvent } from "react";

/* Arrow-key navigation for the `role="tablist"` groups in the mockups.

   They were all click-only: a keyboard user could Tab into the selected tab and
   then had no way to reach the others, because a tablist takes one Tab stop by
   design — the arrows are meant to do the rest. Several of them are the only
   control in their component, so without this the whole demo was mouse-only.

   Focus has to move with the selection, not just the selected state. Leaving
   focus on the old button means focus is sitting on something that has just
   become `tabIndex={-1}`, and the next Tab press jumps somewhere unrelated.

   Call it on the tablist container, not on each tab, so the handler sees the
   group and can find its siblings. */
export function roveTabs(
  event: KeyboardEvent<HTMLElement>,
  count: number,
  index: number,
  select: (next: number) => void,
): void {
  let next: number;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = (index + 1) % count;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = (index - 1 + count) % count;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = count - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  select(next);

  /* The re-render has not happened yet, so the focus call is deferred to the
     frame after it — focusing a button that is about to be re-rendered with a
     new tabIndex is fine, but only once it exists in its new state. */
  const tabs = event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
  const target = tabs[next];
  if (target) requestAnimationFrame(() => target.focus());
}

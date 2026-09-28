"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { Check } from "@/components/ui/icons";

/* The checkbox used everywhere one is needed.

   A native checkbox is drawn by the operating system — a blue square on one
   machine, a green tick on another — and inside a mockup meant to read as the
   Tribe product that is the element that gives it away. `accent-color` tints it
   and nothing else: not the size, not the corner radius, not the tick.

   The input is still a real `<input type="checkbox">`, kept visually hidden
   rather than replaced. Everything that follows from that is free: the label
   association, the form value, the tab order, space to toggle, and how a screen
   reader announces it. The square beside it is decoration driven by `peer-*`.

   The whole row is the target. A 20px box is the most missable control on a
   phone, and the previous version had exactly that — the label made the row
   clickable but the audit still counted a 20px input, because that is what it
   was. */
export function Checkbox({
  checked,
  onChange,
  children,
  id,
  className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /* The row. Anything here toggles the box. */
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={`group flex min-h-11 cursor-pointer items-center gap-3 ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        /* `sr-only` rather than `hidden`: the input has to stay focusable and
           in the accessibility tree, it just must not be painted. */
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        /* The tick lives inside this span, which is the peer's sibling — so the
           checked state reaches it through a descendant selector rather than a
           bare `peer-checked:`, which only matches siblings. */
        className="grid h-5 w-5 shrink-0 place-items-center rounded-[7px] border-2 border-line bg-white transition-[background-color,border-color] duration-150 group-hover:border-brand/50 peer-checked:border-brand peer-checked:bg-brand peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
      >
        <Check
          className="h-3.5 w-3.5 scale-50 text-white opacity-0 transition-[opacity,transform] duration-150"
          strokeWidth={3}
        />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}

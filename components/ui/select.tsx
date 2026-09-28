"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check } from "@/components/ui/icons";

/* The dropdown used everywhere a native <select> used to be.

   A native select cannot be styled where it matters: the popup is drawn by the
   operating system, so the list looked like macOS on one machine and Android on
   another while the page around it looked like Tribe. Inside a mockup that is
   meant to read as the product, that is the one element that gives it away.

   This is the ARIA listbox pattern rather than a div with a click handler:
   button labelled by the value, popup with role="listbox", options with
   aria-selected, arrows and Home/End to move, Enter or Space to choose, Escape
   to dismiss, typeahead for the long lists, and focus returned to the button on
   close. A keyboard user gets what the native control gave them.

   What is deliberately *not* reimplemented: mobile. Below `sm` this still
   renders the native control, because the OS picker on a phone is genuinely
   better than anything drawn in a page — it is thumb-sized, it scrolls with
   momentum, and it does not fight the keyboard. Styling is not worth losing
   that. */
export type SelectOption = {
  value: string;
  label: string;
  /* Optional trailing text, e.g. a masked account tail. */
  hint?: string;
};

export function Select({
  options,
  value,
  onChange,
  label,
  id,
  className = "",
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /* Always required: a control that only makes sense from its surroundings is
     not usable by anybody reading the page through a screen reader. */
  label: string;
  id?: string;
  className?: string;
}) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listId = `${selectId}-list`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === value)),
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const selected = options.find((o) => o.value === value) ?? options[0];

  /* Re-point the highlight at the current value whenever it changes from
     outside, as a render-time adjustment rather than an effect. */
  const [valueAtSync, setValueAtSync] = useState(value);
  if (value !== valueAtSync) {
    setValueAtSync(value);
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
  }

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (
        !listRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  /* Keep the highlighted option in view when the arrows walk past the edge. */
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => (a + 1) % options.length);
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => (a - 1 + options.length) % options.length);
        return;
      case "Home":
        e.preventDefault();
        setActive(0);
        return;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        return;
      case "Escape":
      case "Tab":
        setOpen(false);
        buttonRef.current?.focus();
        return;
    }

    /* Typeahead: "zen" jumps to Zenith. Resets after a second of no typing,
       the way every native listbox behaves. */
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const now = e.timeStamp;
      typed.current.text = now - typed.current.at > 1000 ? e.key : typed.current.text + e.key;
      typed.current.at = now;

      const needle = typed.current.text.toLowerCase();
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(needle));
      if (hit >= 0) setActive(hit);
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Below sm the OS picker wins: it is thumb-sized and does not fight the
          keyboard. Same value, same handler, no duplicated state. */}
      <label className="sr-only" htmlFor={`${selectId}-native`}>
        {label}
      </label>
      <select
        id={`${selectId}-native`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full appearance-none rounded-xl border border-line bg-white bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pl-3 pr-9 text-[14px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand sm:hidden"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a4a66' stroke-width='1.7' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.hint ? ` · ${o.hint}` : ""}
          </option>
        ))}
      </select>

      <button
        ref={buttonRef}
        type="button"
        id={selectId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="hidden min-h-11 w-full items-center gap-2 rounded-xl border border-line bg-white pl-3 pr-2.5 text-left transition-colors hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand sm:flex"
      >
        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">
          {selected?.label}
        </span>
        {selected?.hint && (
          <span className="tnum shrink-0 text-[13px] text-muted">{selected.hint}</span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${selectId}-opt-${active}`}
          onKeyDown={onListKeyDown}
          className="absolute left-0 right-0 top-full z-30 mt-1.5 hidden max-h-[248px] overflow-y-auto rounded-xl bg-white p-1 shadow-[0_18px_40px_-16px_rgba(30,4,51,0.4)] ring-1 ring-line focus:outline-none sm:block"
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li key={o.value} role="none">
                <div
                  id={`${selectId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-[14px] ${
                    i === active ? "bg-brand-soft" : ""
                  }`}
                >
                  <span
                    className={`min-w-0 flex-1 truncate ${
                      isSelected ? "font-bold text-brand" : "font-semibold text-ink"
                    }`}
                  >
                    {o.label}
                  </span>
                  {o.hint && (
                    <span className="tnum shrink-0 text-[13px] text-muted">{o.hint}</span>
                  )}
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

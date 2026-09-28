import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant =
  | "primary" /* solid purple — one per section, at most */
  | "secondary" /* hairline box on white, the default for everything else */
  | "ghost" /* text-only with a chevron, for tertiary links */
  | "onDark"; /* white fill on the few remaining dark surfaces */

const base = "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-deep",
  secondary: "border border-line bg-white text-ink hover:border-ink/25 hover:bg-bone",
  ghost: "text-brand hover:bg-brand-soft",
  onDark: "bg-white text-ink hover:bg-bone focus-visible:outline-white",
};

/* Both steps clear 44px. `md` used to be 40px, which is under every touch
   target guideline going — and it is the default, so most buttons on the site
   were failing it. Raising the default was cheaper than auditing call sites. */
const sizes = {
  md: "h-11 px-4 text-[14px]",
  lg: "h-12 px-5 text-[15px]",
} as const;

type ButtonProps = {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function Button({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

/* Tertiary link with a trailing arrow — replaces the heavy underlined style.

   Colour comes from `tone`, never from the base string and never from a
   caller's `className`. It used to hardcode `text-brand` in the base and let
   callers "override" it — but two utility classes have the same specificity,
   so the cascade decided the winner, not the order they were written. A call
   site passing `className="text-accent"` for orange-on-plum read as correct
   and silently rendered brand purple on plum at 2.02:1. Lighthouse caught it;
   review had not.

   Both tones are from the contrast table in CLAUDE.md. */
const TONES = {
  /* 6.9:1 on white. */
  brand: "text-brand hover:text-brand-deep",
  /* 6.3:1 on plum — the only safe orange for text on the dark band. */
  onDark: "text-accent hover:text-accent/80",
} as const;

export function TextLink({
  href,
  children,
  tone = "brand",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  /* `inline-block`, not `inline-flex`. As a flex container the label became an
     anonymous flex item wider than the line, so it shrank, wrapped to two lines
     and left the arrow stranded against the right edge of the row. Inline-block
     keeps the arrow immediately after the last word wherever the label breaks.
     The vertical padding is what carries the 44px touch target. */
  return (
    <Link
      href={href}
      className={`group inline-block py-3 text-[15px] font-semibold leading-[1.45] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${TONES[tone]} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

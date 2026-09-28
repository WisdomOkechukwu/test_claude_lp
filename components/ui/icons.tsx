import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* Shared base: 24-unit grid, stroke-driven, inherits currentColor. */
function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m6 9 6 6 6-6" />
    </Stroke>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Stroke>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </Stroke>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Stroke>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 4v16M6 14l6 6 6-6" />
    </Stroke>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 20V4M6 10l6-6 6 6" />
    </Stroke>
  );
}

export function Check(props: IconProps) {
  return (
    <Stroke strokeWidth={2.4} {...props}>
      <path d="m5 13 4.5 4.5L19 7" />
    </Stroke>
  );
}

export function Copy(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
    </Stroke>
  );
}

export function Share(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 15V3M8.5 6.5 12 3l3.5 3.5" />
      <path d="M5 13v5.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V13" />
    </Stroke>
  );
}

export function Menu(props: IconProps) {
  return (
    <Stroke strokeWidth={2} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Stroke>
  );
}

export function Close(props: IconProps) {
  return (
    <Stroke strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Stroke>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M10.5 13.5a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.4 1.4" />
      <path d="M13.5 10.5a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.4-1.4" />
    </Stroke>
  );
}

export function Bolt(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M13.5 3 5 13.5h6L10.5 21 19 10.5h-6L13.5 3Z" />
    </Stroke>
  );
}

export function Gift(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="8.5" width="18" height="12.5" rx="2" />
      <path d="M3 13.5h18M12 8.5V21" />
      <path d="M12 8.5S10.8 3 8 3a2.5 2.5 0 0 0 0 5.5h4Zm0 0S13.2 3 16 3a2.5 2.5 0 0 1 0 5.5h-4Z" />
    </Stroke>
  );
}

export function Vault(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="11" cy="12" r="3.6" />
      <path d="M11 6.2v2.2M11 15.6v2.2M5.6 12h2.2M17.5 9.5v5" />
    </Stroke>
  );
}

export function Wallet(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 8a2 2 0 0 1 2-2h11.5a2 2 0 0 1 2 2" />
      <rect x="3" y="8" width="18" height="12" rx="2.5" />
      <circle cx="16.5" cy="14" r="1.3" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function Bank(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m3 9.5 9-5.5 9 5.5M4.5 9.5V19M9.5 9.5V19M14.5 9.5V19M19.5 9.5V19M3 19.5h18" />
    </Stroke>
  );
}

export function Lock(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </Stroke>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3 4.5 6v6c0 4.5 3.1 7.9 7.5 9 4.4-1.1 7.5-4.5 7.5-9V6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Stroke>
  );
}

export function Fingerprint(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3a8 8 0 0 0-8 8v2" />
      <path d="M20 13v-2a8 8 0 0 0-4-6.9" />
      <path d="M8 12a4 4 0 0 1 8 0v3a5 5 0 0 1-1 3" />
      <path d="M12 12v4a8 8 0 0 1-1.5 4.6" />
      <path d="M16 19.5a9 9 0 0 0 .8-2.3" />
      <path d="M6.5 17.5A7 7 0 0 0 8 15" />
    </Stroke>
  );
}

export function Phone(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10.5 5.5h3" />
    </Stroke>
  );
}

export function Tv(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="2.5" y="5" width="19" height="12.5" rx="2" />
      <path d="M8 21h8M12 17.5V21" />
    </Stroke>
  );
}

export function Wifi(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M2.5 9a14 14 0 0 1 19 0M6 12.5a9 9 0 0 1 12 0M9.5 16a4 4 0 0 1 5 0" />
      <circle cx="12" cy="19.5" r="0.8" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function Receipt(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 3h14v18l-2.3-1.6-2.35 1.6L12 19.4 9.65 21 7.3 19.4 5 21V3Z" />
      <path d="M9 8.5h6M9 12.5h6" />
    </Stroke>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 11l5.6-1.9L12 3.5Z" />
    </Stroke>
  );
}

export function Globe(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 19.5 12 21c-2.4-1.5-3.6-4.5-3.6-9S9.6 5.5 12 3Z" />
    </Stroke>
  );
}

/* ---------- Social ---------- */

export function XLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.2 3h3.3l-7.2 8.2L21.8 21h-6.6l-5.2-6.6L4.1 21H.8l7.7-8.8L.5 3h6.8l4.7 6.1L17.2 3Zm-1.2 16h1.8L7.9 4.8H6L16 19Z" />
    </svg>
  );
}

export function InstagramLogo(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function LinkedinLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.8v1.5a4.2 4.2 0 0 1 3.7-2c3 0 4 2 4 5v6.5h-4V15c0-1.6-.6-2.6-2-2.6-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1v5.4h-4v-11Z" />
    </svg>
  );
}

export function Code(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
    </Stroke>
  );
}

export function Repeat(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 9a5 5 0 0 1 5-5h11m0 0-3-3m3 3-3 3M20 15a5 5 0 0 1-5 5H4m0 0 3 3m-3-3 3-3" />
    </Stroke>
  );
}

export function Split(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 5h4l5 7 5-7h4M3 19h4l3.5-5M21 19h-4" />
    </Stroke>
  );
}

export function Clock(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Stroke>
  );
}

export function Users(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3.2" />
      <path d="M17 4.3a3.2 3.2 0 0 1 0 5.4M22 20v-2a4 4 0 0 0-3-3.8" />
    </Stroke>
  );
}

export function TrendUp(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />
    </Stroke>
  );
}

export function Plus(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 5v14M5 12h14" />
    </Stroke>
  );
}

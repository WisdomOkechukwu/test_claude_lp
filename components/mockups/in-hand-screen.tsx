import { ArrowDown, ArrowUp, Bank, LinkIcon, Wallet, Wifi } from "@/components/ui/icons";
import { naira } from "./format";

/* The screen that sits inside the photographed phone in the hero.

   It is deliberately *not* PhoneMock. PhoneMock is authored at 280px and its
   9-11px type would land around 7px once scaled into the photographed screen,
   which is unreadable — so this is a second, much coarser screen designed for
   exactly one job: being legible at roughly a fifth of the panel's width.

   Everything sizes off a single container-query anchor. The wrapper declares
   `container-type: inline-size`, the root sets `font-size` in `cqw`, and every
   measurement below is in `em`. That means the screen scales perfectly with
   the photograph at any viewport without a single breakpoint, and it cannot
   drift out of register the way a hand-tuned `scale()` would.

   No state, no time, no random — it renders identically on both passes. */

const ACTIONS = [
  { label: "Send", Icon: ArrowUp },
  { label: "Collect", Icon: LinkIcon },
  { label: "Bills", Icon: Wallet },
] as const;

const ROWS = [
  { dir: "in", name: "Ada Designs", amount: 45_000 },
  { dir: "out", name: "Airtime run", amount: 82_000 },
  { dir: "in", name: "Loan sweep", amount: 128_000 },
  { dir: "out", name: "Vendor payout", amount: 60_000 },
] as const;

export function InHandScreen() {
  return (
    <div
      style={{ containerType: "inline-size" }}
      className="h-full w-full overflow-hidden"
      /* Decorative: the hero heading and the panel below already say all of
         this in text, so a screen reader gains nothing from re-reading it. */
      aria-hidden="true"
    >
      <div
        style={{ fontSize: "6cqw" }}
        className="flex h-full flex-col bg-white px-[0.7em] pt-[0.5em] text-ink"
      >
        <div className="flex items-center justify-between text-[0.62em] font-semibold">
          <span className="tnum">9:41</span>
          <span className="flex items-center gap-[0.3em]">
            <Wifi className="h-[1em] w-[1em]" />
            <span className="inline-block h-[0.7em] w-[1.4em] rounded-[0.15em] border border-ink" />
          </span>
        </div>

        <div className="mt-[0.7em] flex items-center gap-[0.4em]">
          <span className="grid h-[1.5em] w-[1.5em] place-items-center rounded-full bg-brand text-[0.7em] font-bold text-white">
            T
          </span>
          <span className="text-[0.78em] font-bold">Tribe</span>
        </div>

        <div className="mt-[0.6em] rounded-[0.5em] bg-brand p-[0.6em] text-white">
          <p className="text-[0.52em] uppercase tracking-[0.1em] opacity-75">
            Available balance
          </p>
          <p className="tnum mt-[0.15em] text-[1.3em] font-bold leading-none">
            {naira(2_486_400)}
          </p>
          <p className="mt-[0.4em] text-[0.5em] opacity-75">NGN · Main account</p>
        </div>

        <ul className="mt-[0.6em] grid grid-cols-3 gap-[0.35em]">
          {ACTIONS.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-[0.2em] rounded-[0.4em] bg-bone py-[0.45em] text-[0.5em] font-semibold"
            >
              <Icon className="h-[1.4em] w-[1.4em] text-brand" />
              {label}
            </li>
          ))}
        </ul>

        <p className="mt-[0.7em] text-[0.55em] font-semibold text-muted">Today</p>

        <ul className="flex-1">
          {ROWS.map((r) => (
            <li
              key={r.name}
              className="flex items-center gap-[0.4em] border-b border-line py-[0.4em]"
            >
              <span className="grid h-[1.4em] w-[1.4em] shrink-0 place-items-center rounded-full bg-bone">
                {r.dir === "in" ? (
                  <ArrowDown className="h-[0.85em] w-[0.85em] text-brand" />
                ) : (
                  <ArrowUp className="h-[0.85em] w-[0.85em] text-muted" />
                )}
              </span>
              <span className="truncate text-[0.56em] text-muted">{r.name}</span>
              <span className="tnum ml-auto shrink-0 text-[0.56em] font-semibold">
                {r.dir === "in" ? "+" : "−"}
                {naira(r.amount)}
              </span>
            </li>
          ))}
        </ul>

        <p className="mb-[0.7em] flex items-center justify-center gap-[0.3em] rounded-[0.4em] bg-brand-soft px-[0.5em] py-[0.45em] text-[0.52em] font-bold text-brand">
          <Bank className="h-[1.1em] w-[1.1em]" />
          Settles to GTBank tomorrow
        </p>
      </div>
    </div>
  );
}

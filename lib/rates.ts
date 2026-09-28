import type { BrandKey } from "@/components/brand-logos";

/* The gift card rate board, and the one place its shape is defined.

   The site ships a fallback set and the backend pushes over it. Both the API
   route and the trade mockup import from here, so a rate can never be
   "current" in one and stale in the other.

   Rates are whole naira per unit of the card's own currency. */
export type Rate = {
  brand: BrandKey;
  region: string;
  rate: number;
};

export type RateBoard = {
  rates: Rate[];
  /* ISO 8601 with an offset, matching the API's timestamp convention. Null on
     the fallback set, because nothing has been pushed yet and a fabricated
     timestamp would read as freshness the board does not have. */
  updated_at: string | null;
  source: "fallback" | "pushed";
};

/* What the page renders before anything is pushed, and what it falls back to
   if the fetch fails. Deliberately the same four the mockup has always shown,
   so the first paint is identical whether or not the backend has spoken. */
export const FALLBACK_RATES: Rate[] = [
  { brand: "steam", region: "US", rate: 1385 },
  { brand: "itunes", region: "UK", rate: 1460 },
  { brand: "googleplay", region: "US", rate: 1340 },
  { brand: "netflix", region: "US", rate: 1420 },
];

/* In-memory, and that is a deliberate limit rather than an oversight.

   This holds for the lifetime of one server process. On a single long-running
   Node server — `next start` behind nginx, which is how CLAUDE.md says this
   deploys — that is exactly right and needs nothing else. On a serverless
   platform each instance keeps its own copy and loses it when the instance
   recycles, so a push would reach one lambda and not the next.

   If this ever runs serverless, swap the two functions below for a real store
   (Redis, KV, a table). Nothing else has to change: the route and the client
   only ever go through `readBoard` and `writeBoard`. */
let board: RateBoard = {
  rates: FALLBACK_RATES,
  updated_at: null,
  source: "fallback",
};

export function readBoard(): RateBoard {
  return board;
}

export function writeBoard(rates: Rate[], at: string): RateBoard {
  board = { rates, updated_at: at, source: "pushed" };
  return board;
}

const BRANDS: BrandKey[] = ["steam", "itunes", "googleplay", "netflix"];

/* Validation lives here rather than in the route so the shape is checked in
   the same file that defines it. Returns the parsed rates, or a reason. */
export function parseRates(
  input: unknown,
): { ok: true; rates: Rate[] } | { ok: false; reason: string } {
  if (typeof input !== "object" || input === null) {
    return { ok: false, reason: "Body must be a JSON object." };
  }

  const raw = (input as { rates?: unknown }).rates;
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: false, reason: "rates must be a non-empty array." };
  }
  if (raw.length > 100) {
    return { ok: false, reason: "rates cannot exceed 100 entries." };
  }

  const rates: Rate[] = [];
  for (const [i, entry] of raw.entries()) {
    if (typeof entry !== "object" || entry === null) {
      return { ok: false, reason: `rates[${i}] must be an object.` };
    }
    const { brand, region, rate } = entry as Record<string, unknown>;

    if (typeof brand !== "string" || !BRANDS.includes(brand as BrandKey)) {
      return {
        ok: false,
        reason: `rates[${i}].brand must be one of ${BRANDS.join(", ")}.`,
      };
    }
    if (typeof region !== "string" || !/^[A-Z]{2}$/.test(region)) {
      return { ok: false, reason: `rates[${i}].region must be two capitals, e.g. US.` };
    }
    /* Whole naira. A rate of 0 or a negative one is a bug upstream, not a
       promotion, and an absurd one is a decimal-point slip. */
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0 || rate > 100_000) {
      return { ok: false, reason: `rates[${i}].rate must be naira between 1 and 100000.` };
    }

    rates.push({ brand: brand as BrandKey, region, rate: Math.round(rate) });
  }

  return { ok: true, rates };
}

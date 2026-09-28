import {
  API_GROUPS,
  BANK_CODES,
  ERRORS,
  WEBHOOK_EVENTS,
} from "@/components/developers/api-data";

/* The index the docs search runs over, built from the same data the pages
   render — so an endpoint cannot exist in the reference and be missing from
   search, which is what happens the moment a search index is written by hand.

   Everything here is derived at module scope: this file is imported by a client
   component, but nothing in it depends on the browser, so it costs one pass at
   build time and ships as a constant. */

export type Kind = "endpoint" | "event" | "error" | "guide" | "bank";

export type Doc = {
  kind: Kind;
  title: string;
  /* What the entry is, in one line, shown under the title. */
  detail: string;
  href: string;
  /* Everything matchable, lowercased and joined once rather than per keystroke. */
  haystack: string;
};

/* Plain-language words people actually type, mapped onto the vocabulary the
   docs use. This is what makes "how do I pay someone" find POST /transfers
   rather than nothing: the query is expanded before it is matched, so a reader
   does not have to already know we call it a withdrawal.

   Left side is what someone types; right side is what the docs say. */
const SYNONYMS: Record<string, string[]> = {
  // Money out
  payout: ["withdrawal", "settlement", "bank"],
  payouts: ["withdrawal", "settlement"],
  withdraw: ["withdrawal", "settlement", "payout"],
  cashout: ["withdrawal", "settlement"],
  "cash out": ["withdrawal", "settlement"],
  disburse: ["withdrawal", "disbursement", "payout"],
  send: ["transfer", "withdrawal", "payout"],
  sending: ["transfer", "withdrawal"],
  pay: ["transfer", "withdrawal", "deposit", "payout"],
  paid: ["deposit", "transfer", "repayment"],
  paying: ["transfer", "withdrawal", "deposit"],
  transfer: ["transfer", "withdrawal", "deposit"],
  // Money in
  charge: ["deposit", "collection", "payment link"],
  charged: ["deposit", "collection"],
  collect: ["deposit", "collection", "payment link", "nqr"],
  collecting: ["deposit", "collection"],
  receive: ["deposit", "collection"],
  invoice: ["payment link", "deposit"],
  checkout: ["payment link", "deposit"],
  qr: ["nqr"],
  "qr code": ["nqr"],
  card: ["deposit", "payment link"],
  // People
  customer: ["user"],
  customers: ["user"],
  borrower: ["user", "loan"],
  recipient: ["user", "transfer"],
  account: ["user", "vault", "bank code"],
  // Lending
  lend: ["loan", "repayment"],
  lending: ["loan", "repayment"],
  repay: ["repayment", "loan"],
  repayment: ["repayment", "loan"],
  arrears: ["arrears", "loan", "overdue"],
  overdue: ["arrears", "loan"],
  default: ["arrears", "loan"],
  // Trouble
  failed: ["error", "failed", "rejected", "returned"],
  failing: ["error", "failed"],
  "not working": ["error", "failed"],
  broken: ["error", "failed"],
  missing: ["not_found", "error"],
  stuck: ["queued", "error", "pending"],
  bounced: ["returned", "failed"],
  reversed: ["returned", "refund"],
  refund: ["returned", "refund"],
  declined: ["failed", "rejected"],
  "not arrived": ["queued", "withdrawal", "returned"],
  "has not arrived": ["queued", "withdrawal", "returned"],
  late: ["queued", "arrears"],
  duplicate: ["duplicate_reference", "idempotency", "reference"],
  twice: ["duplicate_reference", "idempotency", "reference"],
  /* Phrases carry an intent the words do not: "paid twice" is a question about
     idempotency, while "paid" on its own is a question about deposits. Phrases
     are expanded before single words, so the specific reading wins. */
  "paid twice": ["duplicate_reference", "idempotency"],
  "charged twice": ["duplicate_reference", "idempotency"],
  "sent twice": ["duplicate_reference", "idempotency"],
  "double charge": ["duplicate_reference", "idempotency"],
  "same reference": ["duplicate_reference", "idempotency"],
  double: ["duplicate_reference", "idempotency"],
  /* The consumer app calls it a cashpoint; the API only knows user ids. */
  cashpoint: ["transfer", "user"],
  cashpoints: ["transfer", "user"],
  // Mechanics
  webhook: ["webhook", "event", "signature"],
  webhooks: ["webhook", "event", "signature"],
  callback: ["webhook", "event"],
  signature: ["signature", "webhook", "hmac"],
  verify: ["signature", "webhook"],
  auth: ["authentication", "key", "bearer"],
  key: ["key", "authentication", "sandbox"],
  keys: ["key", "authentication", "sandbox"],
  token: ["key", "authentication"],
  test: ["sandbox", "test key"],
  sandbox: ["sandbox", "test key"],
  ratelimit: ["rate_limited", "429"],
  "rate limit": ["rate_limited", "429"],
  bank: ["bank code", "nibss", "withdrawal"],
  "bank code": ["bank code", "nibss"],
  split: ["split", "vault"],
  branch: ["vault", "split"],
  subaccount: ["vault"],
  "sub account": ["vault"],
  vault: ["vault", "split", "settlement"],
  giftcard: ["giftcard", "treasury"],
  "gift card": ["giftcard", "treasury"],
  bills: ["disbursement", "biller"],
  airtime: ["disbursement", "biller"],
  electricity: ["disbursement", "biller"],
};

const STOPWORDS = new Set([
  "a", "an", "the", "how", "do", "does", "did", "i", "we", "you", "to", "for",
  "of", "in", "on", "is", "are", "was", "can", "could", "would", "should",
  "what", "when", "where", "why", "which", "my", "me", "it", "its", "and",
  "or", "with", "from", "get", "set", "up", "make", "use", "using", "help",
  "please", "there", "that", "this", "be", "been", "have", "has", "had",
]);

/* Guides are hand-written because they are the only entries with no data
   behind them — a page section is not a resource. */
const GUIDES: Doc[] = [
  ["Quickstart", "Four calls to go live: keys, a user, money, the webhook.", "/developers#quickstart", "quickstart start begin first integration tutorial getting started"],
  ["Keys and environments", "sk_test_ and sk_live_, and a sandbox that fails the way production does.", "/developers#keys", "key api key secret public sandbox test live environment authentication bearer rotate"],
  ["Webhook signing", "HMAC-SHA512 over the raw body, compared in constant time.", "/developers#webhooks", "webhook signature hmac sha512 verify raw body replay retry idempotent"],
  ["Security notes", "Key rotation, signature verification, replays and IP allowlisting.", "/developers#security", "security rotate allowlist ip leak replay constant time"],
  ["SDKs", "Node, Laravel, Python and Go, walking the same four calls.", "/developers#sdks", "sdk node laravel php python go golang library package client install"],
  ["Bank codes", "NIBSS institution codes, searchable, with the whole list as JSON.", "/developers/bank-codes", "bank code nibss institution list json gtbank kuda opay"],
  ["Conventions", "Auth, amounts in naira, idempotency, pagination, timestamps, rate limits.", "/developers/api#conventions", "convention amount naira kobo idempotency reference pagination cursor timestamp timezone rate limit"],
].map(([title, detail, href, extra]) => ({
  kind: "guide" as const,
  title,
  detail,
  href,
  haystack: `${title} ${detail} ${extra}`.toLowerCase(),
}));

const ENDPOINTS: Doc[] = API_GROUPS.flatMap((group) =>
  group.endpoints.map((e) => ({
    kind: "endpoint" as const,
    title: `${e.method} ${e.path}`,
    detail: e.summary,
    href: `/developers/api#${group.id}`,
    haystack: [
      e.method,
      e.path,
      e.summary,
      group.title,
      group.blurb,
      e.params.map((p) => `${p.name} ${p.detail}`).join(" "),
    ]
      .join(" ")
      .toLowerCase(),
  })),
);

const EVENTS: Doc[] = WEBHOOK_EVENTS.map((e) => ({
  kind: "event" as const,
  title: e.name,
  detail: e.detail,
  href: `/developers/api#event-${e.name.replace(/\./g, "-")}`,
  haystack: `${e.name} ${e.detail} webhook event ${e.payload}`.toLowerCase(),
}));

const ERROR_DOCS: Doc[] = ERRORS.map((e) => ({
  kind: "error" as const,
  title: `${e.status} ${e.code}`,
  detail: e.detail,
  href: `/developers/api#error-${e.code}`,
  haystack: `${e.status} ${e.code} ${e.detail} error failed ${e.body}`.toLowerCase(),
}));

const BANKS: Doc[] = BANK_CODES.map((b) => ({
  kind: "bank" as const,
  title: b.name,
  detail: `NIBSS code ${b.code}`,
  href: "/developers/bank-codes",
  haystack: `${b.name} ${b.code} ${b.slug} bank code nibss`.toLowerCase(),
}));

export const DOCS: Doc[] = [
  ...GUIDES,
  ...ENDPOINTS,
  ...EVENTS,
  ...ERROR_DOCS,
  ...BANKS,
];

export const KIND_LABEL: Record<Kind, string> = {
  guide: "Guide",
  endpoint: "Endpoint",
  event: "Webhook",
  error: "Error",
  bank: "Bank",
};

/* Split a question into the terms worth matching, then widen it.

   "how do I know a payout failed" -> know payout failed
     -> know withdrawal settlement bank error failed rejected returned
   which reaches withdrawal.returned and 422 rail_rejected, neither of which
   shares a word with the question as typed.

   Terms come back weighted, because not every word in a question carries the
   same amount of intent. "customer paid twice" is a question about paying
   twice; "customer" is just who it happened to. Weighting the phrase above the
   loose words is what stops POST /users winning a question about idempotency. */
export type Term = { term: string; weight: number };

/* Who something happened to, rather than what happened. Real words that should
   still match — just not loudly enough to outrank the verb. */
const ACTORS = new Set([
  "customer", "customers", "client", "clients", "someone", "somebody",
  "person", "people", "merchant", "business", "borrower", "user", "users",
  "recipient", "friend",
]);

export function expandWeighted(query: string): Term[] {
  const q = query.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").trim();
  if (!q) return [];

  const weights = new Map<string, number>();
  const add = (term: string, weight: number) => {
    weights.set(term, Math.max(weights.get(term) ?? 0, weight));
  };

  /* Two-word phrases first — "rate limit" and "gift card" mean something the
     halves do not, and "paid twice" means something neither half does.

     A phrase match also suppresses its own component words, so the broad sense
     of "paid" does not go on competing with the specific sense of "paid twice"
     that the reader actually asked about. */
  const consumed = new Set<string>();
  for (const phrase of Object.keys(SYNONYMS)) {
    if (phrase.includes(" ") && q.includes(phrase)) {
      add(phrase, 3);
      for (const t of SYNONYMS[phrase]) add(t, 3);
      for (const w of phrase.split(" ")) consumed.add(w);
    }
  }

  for (const word of q.split(/\s+/)) {
    if (!word || STOPWORDS.has(word) || consumed.has(word)) continue;

    const weight = ACTORS.has(word) ? 0.35 : 1;
    add(word, weight);

    /* Cheap stemming: plurals and -ing, so "payouts" and "paying" both land. */
    const stem = word.replace(/(ing|ed|s)$/, "");
    if (stem.length > 2) add(stem, weight * 0.9);

    for (const t of SYNONYMS[word] ?? []) add(t, weight);
    for (const t of SYNONYMS[stem] ?? []) add(t, weight * 0.9);
  }

  return [...weights].map(([term, weight]) => ({ term, weight }));
}

/* The plain term list, for anything that only needs to know what was searched. */
export function expand(query: string): string[] {
  return expandWeighted(query).map((t) => t.term);
}

export function search(query: string, limit = 8): Doc[] {
  const terms = expandWeighted(query);
  if (!terms.length) return [];

  const scored = DOCS.map((doc) => {
    let score = 0;
    let matched = 0;
    const title = doc.title.toLowerCase();

    for (const { term, weight } of terms) {
      if (!doc.haystack.includes(term)) continue;
      matched++;
      /* A term in the title is worth far more than one buried in a payload —
         otherwise every long JSON body outranks the endpoint it belongs to. */
      score += weight * (title.includes(term) ? 8 : 1);
      if (title === term || title.endsWith(`/${term}`)) score += weight * 6;
    }

    /* Nothing matched: no bonus can rescue it. This used to sit outside the
       guard, which gave every guide a standing 0.5 — so a question that
       matched nothing at all still returned the guide list, ranked by array
       order, looking like a considered answer. */
    if (!matched) return { doc, score: 0 };

    /* Two terms hitting one entry is a much stronger signal than one term
       hitting it twice as hard: "customer paid twice" should reach
       409 duplicate_reference rather than POST /users. */
    score += matched * 2;

    /* A guide is the right answer to a broad question and the wrong answer to
       a specific one; this tilts ties toward it without letting it win a
       lookup for an exact endpoint path. */
    if (doc.kind === "guide") score += 0.5;

    /* Thirty institutions would otherwise flood any query with a common word
       in it — "take money by QR" should not surface FairMoney. A bank has to
       be matched squarely to be worth showing. */
    if (doc.kind === "bank") score -= 6;

    return { doc, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((r) => r.doc);
}

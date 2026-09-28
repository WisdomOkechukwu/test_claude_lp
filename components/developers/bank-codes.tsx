"use client";

import { useMemo, useState } from "react";
import { Button, TextLink } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { CodeBlock } from "@/components/developers/code-block";
import { DocsSearch } from "@/components/developers/docs-search";
import { CopyButton } from "@/components/developers/copy-button";
import { BANK_CODES, BANK_KINDS, BASE_URL, type Bank } from "@/components/developers/api-data";
import { Check, Copy } from "@/components/ui/icons";

/* Codes used to live in a column at the bottom of the errors band, where you
   had to already know they existed to find them. They are a lookup — the thing
   someone alt-tabs to mid-integration — so they get a page, a filter, and the
   list in a form you can paste into a seed file.

   The JSON is derived from the same array the table renders, not typed out
   again beside it. Two lists that can disagree is how a bank code ends up
   correct in the table and wrong in the snippet. */
const JSON_SNIPPET = JSON.stringify(
  { data: BANK_CODES, has_more: false, next_cursor: null },
  null,
  2,
);

type Kind = "all" | Bank["kind"];
const KINDS: Kind[] = ["all", ...(Object.keys(BANK_KINDS) as Bank["kind"][])];

function matches(bank: Bank, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    bank.name.toLowerCase().includes(needle) ||
    bank.code.includes(needle) ||
    bank.slug.includes(needle)
  );
}

export function BankCodes() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind>("all");

  const shown = useMemo(
    () =>
      BANK_CODES.filter(
        (b) => (kind === "all" || b.kind === kind) && matches(b, query),
      ),
    [query, kind],
  );

  return (
    <>
      <section className="overflow-hidden pt-14 pb-14 sm:pt-20 sm:pb-16">
        <Container>
          <Eyebrow className="text-brand">Reference</Eyebrow>
          <h1 className="display max-w-[15ch] display-hero">Bank codes</h1>
          <p className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-muted">
            Withdrawals take a NIBSS institution code, not a bank name. Thirty of them cover almost all Nigerian traffic — but new
            microfinance banks and wallets join the rail continually, so treat
            this page as a convenience and{" "}
            <code className="font-mono text-[15px] text-ink">GET /bank_codes</code>{" "}
            as the authority.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/developers/api#settlement" variant="secondary" size="lg">
              Withdrawals API
            </Button>
            <TextLink href="/developers/api#transfers">Transfers API</TextLink>
          </div>

          <div className="mt-10 max-w-[560px]">
            <DocsSearch />
          </div>
        </Container>
      </section>

      <Band id="codes" className="bg-bone">
        <Container>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
            <div className="min-w-0 flex-1 basis-[260px]">
              <label
                htmlFor="bank-search"
                className="mb-2 block text-[13px] font-semibold"
              >
                Find a bank
              </label>
              <input
                id="bank-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, code or slug"
                className="min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div
              role="group"
              aria-label="Filter by institution type"
              className="flex flex-wrap gap-1.5"
            >
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={kind === k}
                  onClick={() => setKind(k)}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    kind === k
                      ? "bg-brand text-white"
                      : "border border-line bg-white text-ink hover:border-brand/40 hover:bg-brand-soft"
                  }`}
                >
                  {k === "all" ? "All" : BANK_KINDS[k]}
                </button>
              ))}
            </div>
          </div>

          {/* The count is the live region, not the table — announcing thirty
              rows on every keystroke is worse than saying how many there are. */}
          <p className="mt-6 text-[14px] text-muted" aria-live="polite">
            {shown.length} of {BANK_CODES.length}{" "}
            {shown.length === 1 ? "institution" : "institutions"}
          </p>

          {shown.length > 0 ? (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {shown.map((b) => (
                <li
                  key={b.code}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3"
                >
                  <span className="min-w-0 flex-1 basis-[180px] text-[15px] font-semibold">
                    {b.name}
                  </span>
                  <span className="text-[13px] text-muted">
                    {BANK_KINDS[b.kind]}
                  </span>
                  <span className="tnum ml-auto shrink-0 font-mono text-[14px] font-bold">
                    {b.code}
                  </span>
                  <CodeCopy code={b.code} name={b.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-line bg-white px-5 py-8 text-center text-[15px] text-muted">
              Nothing matches &ldquo;{query}&rdquo;. Every institution on the
              rail is in{" "}
              <code className="font-mono text-[14px] text-ink">
                GET /bank_codes
              </code>
              , including the ones added since this page shipped.
            </p>
          )}
        </Container>
      </Band>

      <Band id="json">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:items-start lg:gap-14">
            <div className="max-w-[52ch]">
              <Eyebrow className="text-brand">The whole list</Eyebrow>
              <h2 className="heading display-section">
                Take it as JSON and stop looking things up
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-muted">
                The same thirty institutions in the shape{" "}
                <code className="font-mono text-[15px] text-ink">
                  GET /bank_codes
                </code>{" "}
                returns — so a seed file written against this will not need
                rewriting when you switch to the live call.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Paginated in the real thing:{" "}
                <code className="font-mono text-[14px] text-ink">has_more</code>{" "}
                and{" "}
                <code className="font-mono text-[14px] text-ink">next_cursor</code>{" "}
                come back on every page, and you pass the cursor as{" "}
                <code className="font-mono text-[14px] text-ink">
                  starting_after
                </code>
                .
              </p>
              <Button
                href="/developers/api#settlement"
                variant="secondary"
                size="lg"
                className="mt-8"
              >
                Where a code is used
              </Button>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <CodeBlock
                label={`GET ${BASE_URL}/bank_codes`}
                copyLabel="Copy the request"
                code={`curl ${BASE_URL}/bank_codes \\
  -H "Authorization: Bearer sk_live_9f2c"`}
              />
              {/* Capped in height: thirty institutions is four hundred lines of
                  JSON, and a page you have to scroll past is worse than a pane
                  you scroll inside. Copy takes all of it regardless. */}
              <CodeBlock
                label="200 OK"
                copyLabel="Copy every bank code as JSON"
                code={JSON_SNIPPET}
                className="max-h-[560px] overflow-y-auto"
              />
            </div>
          </div>
        </Container>
      </Band>
    </>
  );
}

/* A per-row copy, because the thing anyone came here for is one code. Light
   surface, so it cannot reuse CopyButton's on-dark styling. */
function CodeCopy({ code, name }: { code: string; name: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-label={copied ? `${name} code copied` : `Copy the ${name} code`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          /* Not a secure context — confirm anyway; the code is on screen. */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {copied ? (
        <Check className="h-4 w-4 text-brand" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

export { CopyButton };

import { Button } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { CodeBlock } from "@/components/developers/code-block";
import { DocsSearch } from "@/components/developers/docs-search";
import { EndpointSdk } from "@/components/developers/endpoint-sdk";
import {
  API_GROUPS,
  BASE_URL,
  ERRORS,
  ERROR_ENVELOPE,
  WEBHOOK_ENVELOPE,
  WEBHOOK_EVENTS,
  type Endpoint,
} from "@/components/developers/api-data";

/* Method colours. GET is the quiet one; POST moves money and DELETE is
   destructive, so both carry weight. All three are checked against the tints
   they sit on: brand on brand-soft is 6.9:1, accent-ink on accent-soft 7.8:1
   (the one orange CLAUDE.md sanctions as text), ink on bone 15:1. */
const METHOD_STYLES: Record<Endpoint["method"], string> = {
  GET: "bg-bone text-ink",
  POST: "bg-brand-soft text-brand",
  DELETE: "bg-accent-soft text-accent-ink",
};

function MethodPill({ method }: { method: Endpoint["method"] }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold ${METHOD_STYLES[method]}`}
    >
      {method}
    </span>
  );
}

function EndpointBlock({ endpoint }: { endpoint: Endpoint }) {
  const { method, path, summary, params, sample, response, sdk } = endpoint;

  return (
    <article className="border-t border-line pt-10">
      <div className="flex flex-wrap items-center gap-3">
        <MethodPill method={method} />
        <h3 className="font-mono text-[15px] font-semibold break-all">{path}</h3>
      </div>
      <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">
        {summary}
      </p>

      <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0">
          <h4 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-muted">
            Parameters
          </h4>
          <dl className="divide-y divide-line border-y border-line">
            {params.map((p) => (
              <div key={p.name} className="py-3">
                <dt className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="font-mono text-[13.5px] font-semibold">
                    {p.name}
                  </span>
                  <span className="font-mono text-[12px] text-muted">
                    {p.type}
                  </span>
                  {p.required && (
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent-ink">
                      required
                    </span>
                  )}
                </dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-muted">
                  {p.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <CodeBlock code={sample} label={`${method} ${path}`} />
          {/* The same call from an SDK, because that is the next question. */}
          <EndpointSdk call={sdk} path={path} />
          <CodeBlock code={response} label="200 OK" />
        </div>
      </div>
    </article>
  );
}

export function ApiReference() {
  return (
    <>
      <section className="overflow-hidden pt-14 pb-14 sm:pt-20 sm:pb-16">
        <Container>
          <Eyebrow className="text-brand">Reference</Eyebrow>
          <h1 className="display max-w-[15ch] display-hero">API reference</h1>
          <p className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-muted">
            Every resource Tribe exposes. Predictable REST, JSON in and out,
            and one base URL for both environments — the key decides which one
            you are talking to.
          </p>
          <p className="mt-6 inline-block rounded-lg bg-bone px-4 py-2.5 font-mono text-[14px] ring-1 ring-line">
            {BASE_URL}
          </p>
          <div className="mt-9">
            <Button href="/developers" variant="secondary" size="lg">
              Start with the quickstart
            </Button>
          </div>

          <div className="mt-10 max-w-[560px]">
            <DocsSearch />
          </div>
        </Container>
      </section>

      <Band id="conventions" className="bg-bone">
        <Container>
          <h2 className="heading max-w-[22ch] display-section">Conventions</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 lg:grid-cols-2">
            {[
              ["Authentication", <>Bearer token on every request: <code className="font-mono text-[14px] text-ink">Authorization: Bearer sk_live_…</code>. Secret keys never belong in a browser.</>],
              ["Amounts", <>Whole naira, as integers — not kobo. <code className="font-mono text-[14px] text-ink">45000</code> is ₦45,000. Currency is always NGN; there is no second currency to pass.</>],
              ["Idempotency", <>Send your own <code className="font-mono text-[14px] text-ink">reference</code> on writes. Repeat one and you get the original object back, not a second deposit.</>],
              ["Pagination", <>Cursor-based. List endpoints return <code className="font-mono text-[14px] text-ink">has_more</code> and a <code className="font-mono text-[14px] text-ink">next_cursor</code>; pass it back as <code className="font-mono text-[14px] text-ink">starting_after</code>.</>],
              ["Timestamps", <>ISO 8601 with an offset, always <code className="font-mono text-[14px] text-ink">+01:00</code>. Nothing here is UTC, because nothing here settles in UTC.</>],
              ["Rate limits", <>100 requests a second per key, bursting to 200. Over that you get a <code className="font-mono text-[14px] text-ink">429</code> with a <code className="font-mono text-[14px] text-ink">Retry-After</code> header.</>],
            ].map(([term, detail], i) => (
              <div key={i}>
                <dt className="font-semibold">{term}</dt>
                <dd className="mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Band>

      {API_GROUPS.map((group, i) => (
        <Band
          key={group.id}
          id={group.id}
          className={i % 2 === 1 ? "bg-bone" : undefined}
        >
          <Container>
            <h2 className="heading max-w-[22ch] display-section">
              {group.title}
            </h2>
            <p className="mt-5 max-w-[60ch] text-lg text-muted">{group.blurb}</p>
            <div className="mt-12 space-y-12">
              {group.endpoints.map((e) => (
                <EndpointBlock key={e.path + e.method} endpoint={e} />
              ))}
            </div>
          </Container>
        </Band>
      ))}

      <Band id="webhooks">
        <Container>
          <h2 className="heading max-w-[22ch] display-section">Webhook events</h2>
          <p className="mt-5 max-w-[60ch] text-lg text-muted">
            Signed with HMAC-SHA512 over the raw body, in an{" "}
            <code className="font-mono text-[16px] text-ink">X-Tribe-Signature</code>{" "}
            header. Retried for 24 hours on any non-2xx. Assume duplicates and
            out-of-order delivery.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-12">
            <div className="max-w-[60ch]">
              <h3 className="heading text-xl">The envelope</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Every delivery has this shape, whatever the event. Branch on{" "}
                <code className="font-mono text-[14px] text-ink">type</code>,
                read{" "}
                <code className="font-mono text-[14px] text-ink">data</code>, and
                key your handler on{" "}
                <code className="font-mono text-[14px] text-ink">id</code> — that
                is what makes the second delivery of the same event a no-op
                rather than a second payout.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Timestamps are ISO 8601 at{" "}
                <code className="font-mono text-[14px] text-ink">+01:00</code>.
                Amounts are whole naira. Both hold on every payload below.
              </p>
            </div>
            <CodeBlock
              label="Envelope"
              copyLabel="Copy the webhook envelope"
              code={WEBHOOK_ENVELOPE}
              className="min-w-0"
            />
          </div>

          <div className="mt-14 space-y-10">
            {WEBHOOK_EVENTS.map(({ name, detail, payload }) => (
              <article
                key={name}
                id={`event-${name.replace(/\./g, "-")}`}
                className="scroll-mt-24 border-t border-line pt-8"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-start lg:gap-10">
                  <div className="min-w-0">
                    <h3 className="font-mono text-[15px] font-semibold text-brand break-all">
                      {name}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                      {detail}
                    </p>
                  </div>
                  <CodeBlock
                    label={name}
                    copyLabel={`Copy the ${name} payload`}
                    code={payload}
                    className="min-w-0"
                  />
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Band>

      <Band id="errors" className="bg-bone">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-12">
            <div className="max-w-[60ch]">
              <h2 className="heading max-w-[22ch] display-section">Errors</h2>
              <p className="mt-5 text-lg text-muted">
                Conventional status codes, and one body shape behind all of
                them. Branch on{" "}
                <code className="font-mono text-[16px] text-ink">error.code</code>{" "}
                — <code className="font-mono text-[16px] text-ink">message</code>{" "}
                is written for a human reading a log and is not a contract.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Quote{" "}
                <code className="font-mono text-[14px] text-ink">request_id</code>{" "}
                if you ask us about one. It is on every failure, including the
                ones that never reached a rail.
              </p>
            </div>
            <CodeBlock
              label="Error body"
              copyLabel="Copy the error body shape"
              code={ERROR_ENVELOPE}
              className="min-w-0"
            />
          </div>

          <div className="mt-14 space-y-10">
            {ERRORS.map(({ status, code, detail, body }) => (
              <article
                key={code}
                id={`error-${code}`}
                className="scroll-mt-24 border-t border-line pt-8"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-start lg:gap-10">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-mono text-[11px] font-bold ring-1 ring-line">
                        {status}
                      </span>
                      <span className="font-mono text-[15px] font-semibold text-brand break-all">
                        {code}
                      </span>
                    </p>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                      {detail}
                    </p>
                  </div>
                  <CodeBlock
                    label={`${status} ${code}`}
                    copyLabel={`Copy the ${code} body`}
                    code={body}
                    className="min-w-0"
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8">
            <h3 className="heading text-xl">Bank codes</h3>
            <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">
              Withdrawals take a NIBSS institution code rather than a bank name. They have their own page — with the codes, the JSON,
              and the endpoint that is actually authoritative.
            </p>
            <Button
              href="/developers/bank-codes"
              variant="secondary"
              size="lg"
              className="mt-6"
            >
              Bank codes
            </Button>
          </div>
        </Container>
      </Band>

    </>
  );
}

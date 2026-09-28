@AGENTS.md

# Tribe — Nigerian payments landing site

A marketing site for **Tribe**, a fictional Nigerian fintech. Two audiences, two
landing pages, and three supporting ones:

| Route             | Audience              | Entry point                  |
| ----------------- | --------------------- | ---------------------------- |
| `/`               | Businesses            | `app/page.tsx`               |
| `/customers`      | Individual customers  | `app/customers/page.tsx`     |
| `/developers`     | Engineers             | `app/developers/page.tsx`    |
| `/developers/api` | Engineers             | `app/developers/api/page.tsx`|
| `/developers/bank-codes` | Engineers      | `app/developers/bank-codes/page.tsx` |
| `/security`       | Everyone              | `app/security/page.tsx`      |
| `/careers`        | Candidates            | `app/careers/page.tsx`       |
| `/status`         | Everyone              | `app/status/page.tsx`        |
| `/about`          | Everyone              | `app/about/page.tsx`         |

The two landing pages share the nav, footer, security teaser and disclaimer
sections. The nav switches between them with `usePathname()` — it is real
routing, not a toggle over one page.

**The business page runs product-first.** `app/page.tsx` order is deliberate:
hero, how-it-works, collections, settlement, loans, operations, disbursement,
recurring, treasury — *then* "one product, two front doors" and pricing, and
only then testimonials. Both of those are judgements a reader cannot make until
they know what Tribe does, so neither belongs in the middle of the product.

**There is no site disclaimer any more.** `components/disclaimer.tsx` and the
footer's two fictional-brand paragraphs were removed at the owner's
instruction, along with the "Our story" section. Nothing on the site now says
Tribe is a demonstration. That was a deliberate decision, not an oversight —
do not reinstate it without asking, and do not add fabricated figures on the
strength of its absence.

**There is no trust bar and no stats band any more.** Both were deleted: they
stated `₦48b+ settled`, `12,400+ businesses`, a `93%` recovery rate, `99.96%`
uptime, and that balances were "held separately with partner banks" — invented
figures and unverifiable claims presented as fact. `components/how-it-works.tsx`
stands in their place on `/`, and describes the mechanism instead: create a
user, take a deposit, withdraw to your bank. Do not reintroduce a figure nobody
can check.

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # must pass before you call anything done
npm run lint
npx tsc --noEmit
```

## Product scope — read before writing copy

Tribe is **Nigeria-only**. There is no cross-border story, no multi-currency, no
"send money around the world". Everything is NGN, settling on NIBSS/NIP, into
Nigerian banks and wallets (GTBank, Zenith, Access, UBA, First Bank, Kuda,
Moniepoint, Opay, PalmPay).

**What Tribe does**

- Users — one profile per customer, vendor or borrower; everything hangs off it
- Cashpoints — twenty numeric digits identifying a user, and free instant
  user-to-user transfers by that code. Not a bank account: nothing outside
  Tribe can debit it.
- Collections / deposits — payment links, bank transfer, NQR
- Withdrawals and settlement — instant / T+1 / weekly, split across **vaults**
  (a named balance per branch, vendor or product line, each with its own
  cadence). The resource used to be called `sub_accounts`; it is `vaults` now.
- Loan **tracking** — a per-borrower position: paid to date, outstanding,
  instalments, days in arrears. See the next section for what this is not.
- Bulk disbursement — airtime, data, electricity, cable, internet
- Treasury / giftcards — accepting gift cards as payment and selling held
  balances, both converting to naira
- A developer API — keys, sandbox, signed webhooks, SDKs for Node, Laravel,
  Python and Go

**Pricing, so it is not re-invented:** 1% on money in, capped at ₦2,000.
0.5% on settlement out, capped at ₦1,000. User-to-user transfers by cashpoint
are free. No setup fee, no monthly fee. The numbers appear in exactly four
places — `components/hero.tsx`, the price cards in `components/coverage.tsx`,
`components/mockups/payment-link-builder.tsx` and
`components/mockups/settlement-console.tsx`. Keep them in step.

**Tribe is based in Port Harcourt**, not Lagos. It reads in the about story, the
careers block, the footer address, the fraud-review line on the security section
and a testimonial byline.

**The footer no longer carries the fictional-brand disclaimer.** Both paragraphs
were removed at the owner's instruction, along with the Accessibility, Press,
Changelog, Legal, Complaints, Cookie policy and Data requests links.
`components/disclaimer.tsx` still runs at the foot of every page and still says
the product is a demonstration; if that goes too, nothing on the site says so.

**What Tribe does NOT do.** These were removed deliberately. Do not reintroduce
them, and do not invent adjacent versions of them:

- ❌ **Cards, in every direction.** Tribe does not *issue* cards — no expense
  cards, no Tribe card — and as of this revision it does not *accept* them
  either. No checkout, no card token, no card-on-file loan retry, no 3D Secure,
  no `POST /charges`. Money comes in by payment link, bank transfer or NQR and
  nothing else. This is load-bearing rather than cosmetic: `/security` argues
  that the safest record is the one never kept, on the strength of Tribe holding
  no card data at all. Reintroducing a card channel makes that page dishonest.
  *Gift* cards are a different product — store credit converted to naira — and
  stay; say "gift card" rather than "card" wherever both could be meant.
- ❌ **Cashpoints as an API resource.** A cashpoint is a **PIN worth a fixed
  amount**, not a user identifier: you set money aside, Tribe returns twenty
  digits, and whoever holds them redeems it once. It is a consumer-app
  affordance and has no endpoint — `POST /transfers` moves money between two
  **user ids**. An earlier version had it backwards, with `/cashpoints`
  endpoints and a cashpoint as somebody's permanent number.
- ❌ **Direct debit, of any kind.** There is no NIBSS e-mandate, no
  `POST /mandates`, no `POST /debits` and no `mandate.*` or `debit.*` webhook.
  **Tribe never pulls money from anybody's account.** Collecting a loan is the
  lender's relationship with their borrower; Tribe keeps the book, records
  repayments (`POST /loans/{id}/repayments`) and fires `loan.in_arrears` when a
  due date passes. This is load-bearing for `/security`, which argues that
  money only ever leaves because someone here asked it to.
- ❌ **Savings / reserves / pockets** — no interest-bearing product at all.
- ❌ **Invoices**
- ❌ **USSD**
- ❌ **NUBAN / dedicated or virtual account numbers** — say "business account"
  or "account number", never "NUBAN".

Tribe is a demo brand. `components/disclaimer.tsx` and the footer must keep
saying it is fictional, unlicensed, and unaffiliated with NIBSS or any named
bank or biller. Do not present fabricated figures as real.

Never name a financial regulator and never claim a compliance certification —
no CBN, no PCI-DSS. Security copy describes practices, not accreditations. The
security section used to end in a badge row reading `NDPR compliant · ISO 27001 ·
SOC 2 Type II · Independently pen-tested`, which broke that rule three ways over;
it is gone, and so is the footer's "NDPR statement" link. `/security`
(`app/security/page.tsx`, sections in `components/security/`) is the long form
and names no certification anywhere — it closes by saying so explicitly.
`components/security-section.tsx` is the teaser that links to it from both
landing pages.

## Brand

Purple `#6A0DAD` and orange `#FF631C`, sampled from `icon.png` (also the app
icon at `app/icon.png`, which Next serves at `/icon.png`). Tokens live in the
`@theme` block of `app/globals.css` — always use the token, never a raw hex.

### Contrast rules — load-bearing, not decoration

Orange is **2.9:1 on white**. It is an accent, not a text colour on light
surfaces. Getting this wrong has already shipped three bugs.

| Pair                          | Ratio     | Use                                    |
| ----------------------------- | --------- | -------------------------------------- |
| `white` on `brand`            | 9.2:1     | primary buttons, purple bands ✓        |
| `accent` on white             | **2.9:1** | **never text** — fills and icons only  |
| `ink` on `accent`             | 6.5:1     | headings on an orange band ✓           |
| `ink/80` on `accent`          | 5.0:1     | body on an orange band ✓ (floor)       |
| `ink/70` on `accent`          | **4.1:1** | too low — never go below `ink/80`      |
| `white` on `accent`           | **3.0:1** | **fails** — no white type on orange    |
| `muted` on `accent`           | **2.7:1** | **fails** — body cannot stay `muted`   |
| `plum` on `accent`            | 6.3:1     | the dark pill CTA on an orange band ✓  |
| `accent` on `plum`            | 6.3:1     | orange text is fine on the dark band ✓ |
| `accent-ink` on `accent-soft` | 7.8:1     | the only orange safe as light-tint text |
| `white/75` on `brand`         | 5.7:1     | minimum for labels on a purple band    |
| `white/60` on `brand`         | **4.1:1** | too low — do not use for text          |

### Colour is an accent, not a surface

The page is **white-dominant**. Purple and orange appear in small doses —
links, one primary button per section, icon chips, eyebrow labels, a figure —
never as full-bleed bands. An earlier version flood-filled whole sections in
saturated purple and orange; it read loud and cheap, and it was reverted.

- Surfaces are white or `bone` (#f8f7fa), separated by hairline `line` borders.
- Cards get `rounded-xl` + `ring-1 ring-line`. **No heavy drop shadows** — the
  `shadow-[0_30px_70px_...]` style is gone and should not come back.
- Exactly one dark moment per page (the mission banner), for rhythm.
- Photographic blocks use a flat `bg-plum/75` scrim, not a purple→orange
  gradient, and carry white type.
- `.display` is **sentence case**, weight 800. It was briefly uppercase at
  6rem; the uppercase was the loud part, not the size. Two type steps only,
  and they live in `globals.css` as classes — **never retype a clamp inline**,
  that is what made resizing the page a twenty-file edit last time:
  - `.display-hero` — `clamp(3.25rem,7vw,5.75rem)`, 52→92px, tracking -0.038em
  - `.display-section` — `clamp(2rem,3.8vw,3rem)`, 32→48px

  Tracking and line-height tighten as the size grows; if you raise the hero
  step again, tighten them further and re-check `max-w-[15ch]` on the three
  `h1`s, or the headline breaks to two words a line.
- Button variants are `primary` / `secondary` / `ghost` / `onDark`. There are
  no band-specific variants any more.

Because nothing sits on a saturated background, the orange-band contrast rules
that used to live here no longer apply — but keep the `accent on white 2.9:1`
line above in mind: orange still must not be used for text on white.

## Architecture

```
app/
  page.tsx              business landing
  customers/page.tsx    customer landing
  developers/           quickstart + API reference
  security/page.tsx     the security overview
  about/page.tsx        story, values, careers
  layout.tsx            fonts + metadata
  globals.css           @theme tokens, .display/.heading, keyframes
  icon.png              app icon (Next file convention)
components/
  ui/         button, logo, section (Container/Band/Eyebrow), photo, icons, tablist
  mockups/    the interactive product demos — see below
  customers/  sections used only by /customers
  developers/ api-data.ts + the two docs pages' sections
  security/   sections used only by /security
  *.tsx       business sections
public/img/   CC0 photography + CREDITS.md
```

`components/ui/reveal.tsx` is gone. It existed to hold `CountUp`, which animated
the stats band's figures; the stats band went, and nothing else counted.

**`components/developers/api-data.ts` is the single source of truth for the API.**
All three docs pages read from it, including the quickstart's code samples —
those used to be hand-copied into `journey.tsx` and had already drifted. Add an
endpoint there, not in a page.

Webhook events carry the **full body they deliver** and errors carry the **body
that comes back**, both with one shared envelope documented once. A name and a
sentence told an integrator what an event meant but not what to destructure, so
the first thing anyone did was fire a test delivery to find out.

**The docs ship a little JavaScript now, deliberately and narrowly.**
`code-block.tsx` used to say they ship none, which was right while every sample
was read-only. Three things changed that, and each is its own small client
component rather than a boundary around a page:

- `copy-button.tsx` — one per sample, because a payload you have to drag-select
  across a scrolling pane is not usable.
- `docs-search.tsx` + `search-index.ts` — search phrased however the reader
  phrases it. It is a **ranked keyword search with the query widened first**,
  not a model: "my payout has not arrived" expands to `withdrawal settlement
  error returned` before anything is matched, which is what reaches
  `withdrawal.returned` from a question sharing no word with it. Terms are
  weighted — phrases above loose words, and *actor* words ("customer",
  "someone") well below verbs, or "customer paid twice" returns `POST /users`
  instead of `409 duplicate_reference`. The index is derived from `api-data.ts`,
  so an endpoint cannot exist in the reference and be missing from search.
- `bank-codes.tsx` — the filter, and the whole list as copyable JSON generated
  from the same array the table renders.
- `endpoint-sdk.tsx` + `sdk-lang.ts` — the same call through an SDK under every
  endpoint. The language is one shared preference (a module store read through
  `useSyncExternalStore`, the pattern `ui/get-app-button.tsx` already uses), so
  picking Go once picks it for all twenty endpoints and survives a reload.

**SDK samples are generated, not written.** An endpoint declares a `sdk: SdkCall`
— resource, action, args — and `sdk-samples.ts` renders Node, Laravel, Python
and Go from it. Eighty hand-written samples would be eighty chances for two
languages to drift apart on one endpoint, which is the failure `api-data.ts`
exists to prevent. **Every sample initialises the client**: a snippet opening on
`tribe.users.create(...)` assumes the reader already knows where the key goes,
which is the one thing somebody reaching for an SDK sample does not yet know.

Docs search opens as a **translucent overlay**, not an inline dropdown. Inline it
either covered the page it was searching or ran out of height on a phone. The
trigger is a button; `/` and ⌘K open it; Escape closes it and returns focus to
the trigger.

### Photographs go through `ui/photo.tsx`

`PhotoPanel` owns the whole treatment — the `<Image fill>`, the flat scrim, the
rounding and the hairline ring. **Do not hand-roll another `<Image>` + scrim
block**; that is how the page ended up with three different scrims, one of them
the purple→orange gradient the brand rules had already ruled out.

Scrims are a fixed set, not a free prop, because an arbitrary `bg-plum/40`
compiles fine and quietly fails contrast: `base` (75%, the default, safe for
white type), `deep` (85%), `soft` (60%, only where nothing but a mockup sits on
top), `none` (only for a light photo carrying no type — the hero flat-lay).

Reach for `imageClassName` when the panel's aspect differs from the file's:
`object-cover` centre-crops, which can cut the subject clean out of frame.

### Four section shapes

Sections used to be the same `grid lg:grid-cols-2` with copy left and a mockup
right, over and over. Pick a shape deliberately, and alternate which side the
image sits on so the page zig-zags:

- **In-hand hero** (`hero.tsx`) — the live UI registered onto a photographed
  phone screen. The percentages in `SCREEN` are measured off the file; if you
  swap the photograph you must re-measure them.
- **Offset overlap** (`payment-links.tsx`, `customers/transfers.tsx`) — a
  mockup card breaking past the photo's corner. Depth comes from the overlap,
  never a drop shadow. Stacks below `sm`, where an overlap would bury the photo.
- **Wide band** (`utilities.tsx`, `customers/bills.tsx`) — full-width scrimmed
  photo with a heading over it.
- **Two-column** — still fine, just not for everything.

There is **no UI library and no icon package**. Every icon is hand-drawn inline
SVG in `components/ui/icons.tsx` on a 24-unit stroke grid; add new ones there in
the same style. Do not install `lucide-react`, `framer-motion`, shadcn, etc.

Tailwind **v4** — CSS-first config in `globals.css`. There is no
`tailwind.config.js` and adding one is wrong.

## Mockups (`components/mockups/`)

These are the product demos and they are genuinely interactive, not screenshots.
Each is a `"use client"` component driven by `useState`.

**Never use Server Functions here.** The data is fictional; a round trip would
add latency and failure modes for nothing. `useOptimistic`/`useActionState`
solve pending-state-over-a-network, which does not apply.

**Determinism is a hard requirement.** These render on the server and re-render
on the client. Anything that differs between the two passes is a hydration bug:

- No `Math.random()`, `Date.now()`, or `new Date()`. Outcomes are hard-coded
  (see `loan-profile.tsx`) and name resolution is derived from input digits (see
  `transfer-form.tsx`).
- No `Intl.NumberFormat` — a runtime with trimmed ICU groups differently on
  each side. Use `group()` / `naira()` from `mockups/format.ts`.
- Relative time only ("unlocks in 6 months"), never a computed date.

**Semantics.** These replaced fake `<div>`s that were deliberately
`tabIndex={-1}`. Real controls need real markup: `<button>` not `<div>`,
`role="tablist"` + `aria-selected` on tab groups, `aria-live="polite"` on
figures that update, a label on every input.

**Every `role="tablist"` goes through `roveTabs` in `components/ui/tablist.ts`.**
A tablist takes one Tab stop by design, so without arrow keys a keyboard user
reaches the selected tab and can go no further — and several of these groups are
the only control in their component. `roveTabs` also moves focus to the newly
selected tab, which matters because the old one has just become `tabIndex={-1}`.

**Touch targets are 44px, including inside the mockups.** They were not: cadence
chips were 25px, console tabs 30px, gift card buttons 34px. `Button`'s `md` size
is now `h-11` and `lg` is `h-12`; mockup controls carry `min-h-11` explicitly.
A checkbox may stay 20px only where a `<label>` wraps the whole row.

**Rows inside a mockup need `flex-wrap`.** Seven of them ran past 375px with
none — they were written at desktop width and never re-measured. A single
figure/label pair is usually fine; two phrases separated by `ml-auto` is not.

## Animation

`components/ui/reveal.tsx` exports only `CountUp` now (rAF easeOutCubic). The
fade-and-lift is the `.reveal` class in `globals.css` — a scroll-driven CSS
animation, no JavaScript. Put the class on the element itself; wrapping an
element in a `<div class="reveal">` is what previously put a `<div>` between
`<ul>` and `<li>` and failed the list markup audits.

**`.reveal` is expensive at scale and is deliberately rationed.** Lighthouse on
the business page, median of three: eighteen revealed elements → TBT 528ms,
score 80. Eight → 177ms, 89. None → 95ms, 92. It is now on the first content
section or two of each page only. Do not put it on every section again.

The `@supports (animation-timeline: view())` guard is load-bearing: where view
timelines are unsupported no rule applies and the element is simply visible,
which is the same guarantee the old JS version gave a no-JS visitor. Never
write the faded `from` state as an unguarded rule.

Every animation must honour `prefers-reduced-motion`. CSS animations are
switched off in the media query at the bottom of `globals.css`; JS-driven ones
check `matchMedia` and jump straight to the end state. Follow that pattern.

## Images

`public/img/` — **CC0 or Public Domain Mark only**, sourced via the Openverse
API (`https://api.openverse.org/v1/images/?license=cc0,pdm`). Record every file
in `public/img/CREDITS.md`.

**Look at an image before you ship it.** Licence is not the only test — more
candidates have been rejected on these grounds than accepted:

- **Identifiable people may appear** in ambient scene photography. What must
  never happen is a real person being quoted, named, or positioned as
  endorsing Tribe — CC0 covers copyright, not likeness. **Testimonial avatars
  stay as branded initials**; do not put a real face next to an invented quote.
- No **minors**, ever.
- No **third-party logos or trademarks**. This is the rule that actually bites:
  the Yoruba Wikimedians set is the main source of Nigerian CC0 photography
  and nearly every frame has a Wikimedia roll-up banner or a Wikipedia article
  on a projector in it. `operator-phone.jpg` is cropped specifically to cut one
  out — see `public/img/CREDITS.md` before re-cropping anything wider.
- Nothing that **misrepresents the location** — this is a Nigeria-only product,
  so a photo shot elsewhere must not read as Nigeria. Kenya (GES/Nairobi) and
  Ghana (USDA trade mission) sets are both large, both CC0, and both wrong.

**Shared controls live in `components/ui/`, and the native versions are gone.**
`select.tsx` is an ARIA listbox — a native `<select>` draws its popup with the
operating system, so the one element inside a product mockup looked like macOS
or Android rather than like Tribe. It still falls back to the native control
below `sm`, because the OS picker on a phone is genuinely better. `checkbox.tsx`
keeps a real `<input type="checkbox">` visually hidden and draws the box from
`peer-*`, so the label association, tab order and announcement come free. Both
make the whole row a target.

`components/mockups/device.tsx` holds `PhoneShell` and `TerminalShell`. A demo
sits in the surface its audience actually uses: the approval queue on a phone,
a request in a terminal. The frame is doing argumentative work, not decoration.

**Biller tiles use the providers' real marks**, from `public/img/billers/` —
copied out of `assetx/` at the repo root, which the owner supplied and confirmed
Tribe may use. Nothing under `assetx/` is served; only `public/` is, so they are
copied rather than referenced. Every file is square with its background baked in
and no alpha, which is why each tile renders the image *as* the tile rather than
laying a mark over a brand colour. A biller with no file still falls back to its
name on its brand colour, using the `hex` and measured `on` values in
`components/mockups/billers.tsx`. That folder's README lists the full set, what
else `assetx/` holds, and the basis for using them.

**Gift cards show the real brand marks**, on the real brand colours —
`components/brand-logos.tsx`, glyphs from simple-icons (CC0-1.0), inlined as
paths rather than installed. This is a deliberate exception to the
no-third-party-logos rule for images: these identify the cards Tribe actually
converts, which is nominative use and is what `components/disclaimer.tsx`
already disclaims in words. It does **not** license brand artwork anywhere
else on the site — photography rules above are unchanged.

Two things not to undo. The per-brand `ink` value is measured, not styled:
Spotify green and iTunes pink both fail white text, and eBay's official red
fails both foregrounds so its hex is darkened to clear 4.5:1. And the
"Gift card" label runs at full strength — at 0.85 opacity it fell to 3.61:1 on
eBay, 3.69:1 on Netflix and 4.02:1 on PlayStation. Re-measure all ten if you
touch either.

Amazon, Xbox, Sephora and Nordstrom are absent because simple-icons removed
them at those companies' request. Do not redraw them by hand.

The glyphs live in `brand-paths.ts` and are emitted once as an SVG sprite from
`brand-sprite.tsx`, mounted in the root layout; cards reference them by id.
Twenty-one cards each inlining their own copy cost six Lighthouse points. Watch
the byte size of any mark you add for the same reason — Starbucks' siren alone
was 7.6KB and was swapped for Target at 347 bytes.

Read `public/img/CREDITS.md` before sourcing. It records every rejection and
why, and it documents that the usable CC0 pool here is close to exhausted —
several sections carry a mockup instead of a photograph for that reason, not
by oversight.

## Performance and deployment

The pages are long and every route is statically prerendered, so the whole
performance story is **bytes on the critical path**, not rendering. Measured on
the Lighthouse mobile profile, the home page paints nothing until the HTML,
CSS and fonts have all arrived over a 50KB/s pipe. Images are not the problem —
under 30KB loads above the fold and CLS is 0.

**Fonts are the expensive part, and every weight listed in `app/layout.tsx` is
preloaded.** Poppins carries four weights (400/600/700/800) at ~7.6KB each;
500 was removed because it had five call sites. JetBrains Mono is a 39.5KB
variable face used by one below-the-fold component on one route, so it is
loaded with `preload: false` — do not undo that, it was over half of all
preloaded font bytes. Before adding a weight or a family, work out what it
costs on the critical path.

**Do not add `content-visibility: auto` to the sections.** It has been tried
and reverted, and `globals.css` carries the note. It is worth about 130ms of
LCP and it costs two thirds of the accessibility tree — Chrome does not expose
skipped subtrees, so the page went from 34 headings and 103 controls down to
11 and 48. Measure the accessibility tree, not just the LCP, before reaching
for it again.

The hero photographs are deliberately **not** `priority`. The LCP element is
the `<h1>` on every page, so preloading a below-the-fold image only competes
with the fonts the heading actually needs. Measured neutral on desktop and a
saving on mobile.

Code samples scroll sideways rather than wrapping, and `.scroll-edge` in
`globals.css` fades the trailing edge while there is more to come. It is a
two-layer background, not a mask, specifically so it cancels itself out when the
sample already fits — an unconditional fade dimmed the end of every two-line
`.env` block.

`app/loading.tsx` almost never renders, by design of the framework rather than
by mistake. The routes are static, so nothing suspends on a cold load, and Next
prefetches every route's full payload once its link is in view — after that a
click is served from the router cache with no request. The one window it does
cover, verified: hydrated, prefetch still in flight, slow connection. Do not
delete it on the assumption it is dead code, and do not expect to see it in
normal local testing.

**Deploying behind nginx:** `next start` compresses with **gzip only**. Asked
for `br` alone it returns the full uncompressed document — 209KB against 31KB
gzipped for the home page. Brotli has to be enabled at the proxy. Static assets
under `/_next/static` already carry `immutable, max-age=31536000` from Next, so
do not add cache headers for them in `next.config.ts`.

## Before you call it done

1. `npm run build` passes (it runs TypeScript too).
2. `npm run lint` passes.
3. **Load every route under `npm run dev` and read the console.** Not
   `next start` — a production build ships prerendered HTML that already
   matches, and React drops the tag-nesting warnings, so an invalid tree is
   invisible there. A `<div>` inside a `<p>` reached the browser exactly this
   way: every audit had been run against the production server and reported
   zero console errors. `ui/select.tsx` and `ui/checkbox.tsx` both render block
   elements — a `<p>` cannot hold either.
4. Every route is clean at 1280px and at 375px, with no horizontal scroll.
5. Any new colour pairing checked against the table above.
6. Tab through new controls — every one reachable, every one shows a focus ring,
   arrow keys move within every tablist.
7. Re-check with Reduce Motion on.

`AGENTS.md` is regenerated by `next dev`, so it reappears in the diff. Commit it
with your work rather than reverting it.

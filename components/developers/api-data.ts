/* The shape of the fictional Tribe API, in one place so the reference page and
   the journey page cannot drift apart.

   Scope is the product scope in CLAUDE.md and nothing beyond it: users,
   internal transfers, deposits, withdrawals and settlement, loan tracking,
   bulk disbursement and treasury. Cashpoints are a consumer-app affordance —
   twenty digits a person can read out — and deliberately have no endpoint: the
   API moves money between user ids. There is deliberately **no card acceptance of any
   kind** — no checkout, no card token, no card-on-file retry — and no card
   issuing either. There is no savings or reserve balance, no invoice resource,
   and no USSD.

   **Tribe does not debit anybody.** There is no direct debit mandate and no
   `POST /debits`: lending money out and pulling it back are different products,
   and Tribe only does the first half's bookkeeping. `/loans` records what is
   owed and what has come back; a repayment is *recorded*, from a deposit or by
   hand, never pulled from a borrower's bank.

   Amounts are in **naira**, not kobo. A Nigerian engineer reading this should
   not have to multiply by a hundred in their head to check a figure against
   the dashboard.

   The journey page imports its quickstart samples from here rather than
   retyping them — they used to be hand-copied, which is exactly the drift this
   module exists to prevent. */

import type { SdkCall } from "@/components/developers/sdk-samples";

export const BASE_URL = "https://api.tribe.ng/v1";

export type Param = {
  name: string;
  type: string;
  required?: boolean;
  detail: string;
};

export type Endpoint = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  summary: string;
  params: Param[];
  sample: string;
  response: string;
  /* The same call through an SDK, described once and rendered in four
     languages by components/developers/sdk-samples.ts. The reference shows it
     under the cURL, because "how do I do that from Laravel" is the next
     question every time. */
  sdk: SdkCall;
};

export type ApiGroup = {
  id: string;
  title: string;
  blurb: string;
  endpoints: Endpoint[];
};

/* The four calls the quickstart walks through, defined once here and rendered
   on both pages. Keeping them in this module is what stops `/developers` and
   `/developers/api` showing two different payloads for the same endpoint. */
export const QUICKSTART = {
  users: `curl ${BASE_URL}/users \\
  -H "Authorization: Bearer $TRIBE_SECRET_KEY" \\
  -d name="Ada Obi" \\
  -d phone="08031234567" \\
  -d reference="cust-8841"`,
  deposits: `curl ${BASE_URL}/deposits \\
  -H "Authorization: Bearer $TRIBE_SECRET_KEY" \\
  -d user=usr_7Qd2mWc \\
  -d amount=45000 \\
  -d channel=transfer \\
  -d reference="ord-8841"`,
  withdrawals: `curl ${BASE_URL}/withdrawals \\
  -H "Authorization: Bearer $TRIBE_SECRET_KEY" \\
  -d amount=2480000 \\
  -d bank_code=058 \\
  -d account_number=0123456789 \\
  -d cadence=instant`,
} as const;

export const API_GROUPS: ApiGroup[] = [
  {
    id: "users",
    title: "Users",
    blurb:
      "Everyone money moves to or from is a user: a customer paying you, a vendor you pay, a borrower you are collecting from. Create the profile once and every deposit, withdrawal and loan hangs off it.",
    endpoints: [
      {
        method: "POST",
        path: "/users",
        sdk: { resource: "users", action: "create", variable: "user", args: [["name", "Ada Obi"], ["phone", "08031234567"], ["reference", "cust-8841"]] },
        summary: "Create the profile a payment or a loan will belong to.",
        params: [
          { name: "name", type: "string", required: true, detail: "As it should appear on receipts and in your dashboard." },
          { name: "phone", type: "string", required: true, detail: "Eleven digits, Nigerian format." },
          { name: "email", type: "string", detail: "Optional. Used for receipts where you want one sent." },
          { name: "bvn", type: "string", detail: "Optional. Matched against the name on the profile, for borrowers you want verified before you lend." },
          { name: "reference", type: "string", detail: "Your own id, for idempotency. Repeat it and you get the same user back." },
        ],
        sample: QUICKSTART.users,
        response: `{
  "id": "usr_7Qd2mWc",
  "name": "Ada Obi",
  "phone": "08031234567",
  "reference": "cust-8841",
  "balance": 0,
  "currency": "NGN",
  "identity": "unverified"
}`,
      },
      {
        method: "GET",
        path: "/users/{id}",
        sdk: { resource: "users", action: "retrieve", variable: "user", id: "usr_7Qd2mWc" },
        summary: "One user, with their balance and a summary of any loan they hold.",
        params: [
          { name: "expand", type: "string", detail: "Pass loans to inline the full repayment position rather than the summary." },
        ],
        sample: `curl ${BASE_URL}/users/usr_7Qd2mWc \\
  -H "Authorization: Bearer sk_live_9f2c"`,
        response: `{
  "id": "usr_7Qd2mWc",
  "name": "Ada Obi",
  "balance": 12500,
  "currency": "NGN",
  "identity": "bvn_matched",
  "loans": {
    "count": 1,
    "amount_paid": 315000,
    "amount_remaining": 225000
  }
}`,
      },
    ],
  },
  {
    id: "transfers",
    title: "Internal transfers",
    blurb:
      "Move money between two users on your own account. It never leaves Tribe, so there is no rail to wait on, no fee, and nothing to reverse — the balance has changed by the time the request returns.",
    endpoints: [
      {
        method: "POST",
        path: "/transfers",
        sdk: { resource: "transfers", action: "create", variable: "transfer", args: [["from", "usr_7Qd2mWc"], ["to", "usr_2Kf9pRv"], ["amount", 25000], ["note", "Rent share"]] },
        summary: "Move money between two Tribe users. Instant, and free.",
        params: [
          { name: "from", type: "string", required: true, detail: "Sending user id." },
          { name: "to", type: "string", required: true, detail: "Receiving user id." },
          { name: "amount", type: "integer", required: true, detail: "Naira. Cannot exceed the sender's balance." },
          { name: "note", type: "string", detail: "Shown to both sides on the receipt." },
          { name: "reference", type: "string", detail: "Your own id, for idempotency." },
        ],
        sample: `curl ${BASE_URL}/transfers \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d from=usr_7Qd2mWc \\
  -d to=usr_2Kf9pRv \\
  -d amount=25000 \\
  -d note="Rent share"`,
        response: `{
  "id": "trf_2Bt9xKe",
  "status": "completed",
  "from": "usr_7Qd2mWc",
  "to": "usr_2Kf9pRv",
  "amount": 25000,
  "fee": 0,
  "currency": "NGN",
  "note": "Rent share",
  "completed_at": "2026-09-28T19:04:11+01:00"
}`,
      },
    ],
  },
  {
    id: "collections",
    title: "Collections and deposits",
    blurb:
      "Take money in by payment link, bank transfer or NQR. Every channel resolves to the same deposit object, attributed to a user, so you reconcile one way regardless of how the customer paid.",
    endpoints: [
      {
        method: "POST",
        path: "/payment_links",
        sdk: { resource: "paymentLinks", action: "create", variable: "link", args: [["amount", 250000], ["description", "Brand identity — deposit"]] },
        summary: "Create a link you can send, print or embed.",
        params: [
          { name: "amount", type: "integer", detail: "Naira. Omit for a link the payer fills in themselves." },
          { name: "description", type: "string", required: true, detail: "Shown to the payer on the payment page." },
          { name: "reusable", type: "boolean", detail: "Defaults to false — a one-time link closes after the first cleared deposit." },
          { name: "channels", type: "array", detail: "Any of transfer, nqr. Defaults to both." },
          { name: "reference", type: "string", detail: "Your own id. Must be unique; we reject duplicates rather than take the money twice." },
        ],
        sample: `curl ${BASE_URL}/payment_links \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d amount=250000 \\
  -d description="Brand identity — deposit" \\
  -d channels[]=transfer \\
  -d channels[]=nqr`,
        response: `{
  "id": "plink_7Qd2mWc",
  "url": "https://pay.tribe.ng/ada-designs",
  "amount": 250000,
  "currency": "NGN",
  "channels": ["transfer", "nqr"],
  "status": "open"
}`,
      },
      {
        method: "POST",
        path: "/deposits",
        sdk: { resource: "deposits", action: "create", variable: "deposit", args: [["user", "usr_7Qd2mWc"], ["amount", 45000], ["channel", "transfer"], ["reference", "ord-8841"]] },
        summary: "Take money in from a user, on the rail they choose.",
        params: [
          { name: "amount", type: "integer", required: true, detail: "Naira." },
          { name: "user", type: "string", required: true, detail: "User id. Create the user first — a deposit always belongs to somebody." },
          { name: "channel", type: "string", detail: "transfer or nqr. Omit to let the payer pick on the payment page." },
          { name: "reference", type: "string", detail: "Your own id, for idempotency." },
        ],
        sample: QUICKSTART.deposits,
        response: `{
  "id": "dep_5vN8pLt",
  "status": "awaiting_payment",
  "next_action": {
    "type": "payment_page",
    "url": "https://pay.tribe.ng/dep_5vN8pLt"
  },
  "user": "usr_7Qd2mWc",
  "amount": 45000,
  "currency": "NGN"
}`,
      },
      {
        method: "POST",
        path: "/nqr_codes",
        sdk: { resource: "nqrCodes", action: "create", variable: "code", args: [["label", "Counter 2"]] },
        summary: "Mint an NQR code to print and put on the counter.",
        params: [
          { name: "amount", type: "integer", detail: "Naira. Omit for an open code the payer fills in." },
          { name: "label", type: "string", required: true, detail: "Shown in the payer's bank app." },
        ],
        sample: `curl ${BASE_URL}/nqr_codes \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d label="Counter 2"`,
        response: `{
  "id": "nqr_2Bt9xKe",
  "payload": "00020101021138...",
  "image_url": "https://cdn.tribe.ng/nqr/2Bt9xKe.png",
  "label": "Counter 2",
  "status": "active"
}`,
      },
    ],
  },
  {
    id: "settlement",
    title: "Withdrawals and settlement",
    blurb:
      "Move a balance out to your own bank on NIP. Instant, next working day or weekly, optionally split across vaults — a named balance per branch, vendor or product line, each with its own schedule.",
    endpoints: [
      {
        method: "POST",
        path: "/withdrawals",
        sdk: { resource: "withdrawals", action: "create", variable: "payout", args: [["amount", 2480000], ["bank_code", "058"], ["account_number", "0123456789"], ["cadence", "instant"]] },
        summary: "Pay out to a Nigerian bank account.",
        params: [
          { name: "amount", type: "integer", required: true, detail: "Naira." },
          { name: "bank_code", type: "string", required: true, detail: "NIBSS bank code — see /bank_codes." },
          { name: "account_number", type: "string", required: true, detail: "Ten digits." },
          { name: "cadence", type: "string", detail: "instant, next_day or weekly. Defaults to your account setting." },
          { name: "split", type: "array", detail: "Vault ids and shares, if this payout fans out across branches." },
          { name: "reference", type: "string", detail: "Your own id, for idempotency." },
        ],
        sample: QUICKSTART.withdrawals,
        response: `{
  "id": "wdr_3k9xQm2",
  "status": "queued",
  "amount": 2480000,
  "currency": "NGN",
  "bank": "GTBank",
  "rail": "NIP",
  "reference": "TRB-3K9XQM2"
}`,
      },
      {
        method: "GET",
        path: "/bank_codes",
        sdk: { resource: "bankCodes", action: "list", variable: "banks" },
        summary: "Every institution on the rail, with the code a withdrawal needs.",
        params: [
          { name: "q", type: "string", detail: "Filter by name or slug." },
          { name: "starting_after", type: "string", detail: "Cursor from a previous page's next_cursor." },
        ],
        sample: `curl ${BASE_URL}/bank_codes \\
  -H "Authorization: Bearer sk_live_9f2c"`,
        response: `{
  "data": [
    { "code": "058", "name": "GTBank", "slug": "gtbank", "kind": "commercial" },
    { "code": "50211", "name": "Kuda Microfinance Bank", "slug": "kuda", "kind": "fintech" }
  ],
  "has_more": true,
  "next_cursor": "bnk_0192"
}`,
      },
      {
        method: "POST",
        path: "/vaults",
        sdk: { resource: "vaults", action: "create", variable: "vault", args: [["name", "Ikeja branch"], ["bank_code", "033"], ["account_number", "2233445566"], ["cadence", "next_day"]] },
        summary: "Create a named balance that settles on its own schedule.",
        params: [
          { name: "name", type: "string", required: true, detail: "How it appears in the dashboard and on reports." },
          { name: "bank_code", type: "string", required: true, detail: "Where this vault withdraws to — see /bank_codes." },
          { name: "account_number", type: "string", required: true, detail: "Ten digits." },
          { name: "cadence", type: "string", detail: "instant, next_day or weekly. Overrides the account default for this vault only." },
        ],
        sample: `curl ${BASE_URL}/vaults \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d name="Ikeja branch" \\
  -d bank_code=033 \\
  -d account_number=2233445566 \\
  -d cadence=next_day`,
        response: `{
  "id": "vlt_9Wq4dRn",
  "name": "Ikeja branch",
  "bank": "UBA",
  "cadence": "next_day",
  "balance": 0,
  "currency": "NGN"
}`,
      },
      {
        method: "GET",
        path: "/vaults",
        sdk: { resource: "vaults", action: "list", variable: "vaults" },
        summary: "Every vault with its balance and when it next settles.",
        params: [
          { name: "starting_after", type: "string", detail: "Cursor from a previous page's next_cursor." },
        ],
        sample: `curl ${BASE_URL}/vaults \\
  -H "Authorization: Bearer sk_live_9f2c"`,
        response: `{
  "data": [
    { "id": "vlt_9Wq4dRn", "name": "Ikeja branch", "balance": 840000, "cadence": "next_day" },
    { "id": "vlt_4Rm7cZp", "name": "Vendor pool", "balance": 1640000, "cadence": "weekly" }
  ],
  "has_more": false,
  "next_cursor": null
}`,
      },
    ],
  },
  {
    id: "loans",
    title: "Loan tracking",
    blurb:
      "Know where every borrower stands. Register the loan against a user, record repayments as they arrive, and read paid-to-date, outstanding and arrears off one object. Tribe does not debit anybody's account — collecting is your relationship with your borrower; keeping the books straight is ours.",
    endpoints: [
      {
        method: "POST",
        path: "/loans",
        sdk: { resource: "loans", action: "create", variable: "loan", args: [["user", "usr_7Qd2mWc"], ["principal", 450000], ["total_repayable", 540000], ["instalments", 15], ["cadence", "monthly"]] },
        summary: "Register a loan against a user so repayments have somewhere to land.",
        params: [
          { name: "user", type: "string", required: true, detail: "User id. The borrower's profile." },
          { name: "principal", type: "integer", required: true, detail: "Naira disbursed." },
          { name: "total_repayable", type: "integer", required: true, detail: "Naira owed in total, principal and interest together." },
          { name: "instalments", type: "integer", required: true, detail: "How many repayments the total is split across." },
          { name: "cadence", type: "string", required: true, detail: "weekly or monthly. Sets the schedule the tracker measures against." },
          { name: "starts_in_days", type: "integer", detail: "Days until the first instalment is due. Defaults to one full cadence." },
        ],
        sample: `curl ${BASE_URL}/loans \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d user=usr_7Qd2mWc \\
  -d principal=450000 \\
  -d total_repayable=540000 \\
  -d instalments=15 \\
  -d cadence=monthly`,
        response: `{
  "id": "loan_6Hs1tYv",
  "user": "usr_7Qd2mWc",
  "principal": 450000,
  "total_repayable": 540000,
  "amount_paid": 0,
  "amount_remaining": 540000,
  "instalment": 36000,
  "instalments_paid": 0,
  "instalments_total": 15,
  "due_in_days": 30,
  "status": "on_track"
}`,
      },
      {
        method: "GET",
        path: "/loans/{id}",
        sdk: { resource: "loans", action: "retrieve", variable: "loan", id: "loan_6Hs1tYv" },
        summary: "Where a borrower stands: paid to date, what is left, and what is due next.",
        params: [
          { name: "expand", type: "string", detail: "Pass repayments to inline the full history rather than the last three." },
        ],
        sample: `curl ${BASE_URL}/loans/loan_6Hs1tYv \\
  -H "Authorization: Bearer sk_live_9f2c"`,
        response: `{
  "id": "loan_6Hs1tYv",
  "user": "usr_7Qd2mWc",
  "total_repayable": 540000,
  "amount_paid": 315000,
  "amount_remaining": 225000,
  "instalment": 36000,
  "instalments_paid": 9,
  "instalments_total": 15,
  "due_in_days": 6,
  "days_in_arrears": 0,
  "status": "on_track"
}`,
      },
      {
        method: "POST",
        path: "/loans/{id}/repayments",
        sdk: { resource: "loans", nested: "repayments", action: "create", variable: "repayment", id: "loan_6Hs1tYv", args: [["amount", 36000], ["deposit", "dep_5vN8pLt"]] },
        summary: "Record money coming back, from a deposit or from anywhere else.",
        params: [
          { name: "amount", type: "integer", required: true, detail: "Naira." },
          { name: "deposit", type: "string", detail: "Deposit id, if the money came in through Tribe. Omit for cash or a transfer you took elsewhere." },
          { name: "note", type: "string", detail: "Shown on the borrower's history." },
          { name: "reference", type: "string", detail: "Your own id, for idempotency." },
        ],
        sample: `curl ${BASE_URL}/loans/loan_6Hs1tYv/repayments \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d amount=36000 \\
  -d deposit=dep_5vN8pLt \\
  -d reference="rep-sept"`,
        response: `{
  "id": "rep_4Rm7cZp",
  "loan": "loan_6Hs1tYv",
  "amount": 36000,
  "deposit": "dep_5vN8pLt",
  "amount_paid": 351000,
  "amount_remaining": 189000,
  "instalments_paid": 10,
  "status": "on_track"
}`,
      },
      {
        method: "GET",
        path: "/loans",
        sdk: { resource: "loans", action: "list", variable: "book", args: [["status", "in_arrears"]] },
        summary: "The whole book, filterable by how it is doing.",
        params: [
          { name: "status", type: "string", detail: "on_track, in_arrears or settled." },
          { name: "user", type: "string", detail: "One borrower's loans." },
          { name: "starting_after", type: "string", detail: "Cursor from a previous page's next_cursor." },
        ],
        sample: `curl "${BASE_URL}/loans?status=in_arrears" \\
  -H "Authorization: Bearer sk_live_9f2c"`,
        response: `{
  "data": [
    {
      "id": "loan_4Rm7cZp",
      "user": "usr_4Rm7cZp",
      "amount_paid": 90000,
      "amount_remaining": 90000,
      "days_in_arrears": 12,
      "status": "in_arrears"
    }
  ],
  "summary": {
    "count": 1,
    "outstanding": 90000,
    "currency": "NGN"
  },
  "has_more": false,
  "next_cursor": null
}`,
      },
    ],
  },
  {
    id: "disbursement",
    title: "Bulk disbursement",
    blurb:
      "Pay airtime, data, electricity, cable and internet out of the same balance your deposits land in. One call per line, or one file for the whole run.",
    endpoints: [
      {
        method: "POST",
        path: "/disbursements",
        sdk: { resource: "disbursements", action: "create", variable: "run", args: [["biller", "mtn_airtime"], ["reference", "field-team-sept"]] },
        summary: "Send a batch of bill payments in one request.",
        params: [
          { name: "biller", type: "string", required: true, detail: "Biller code — see /billers." },
          { name: "items", type: "array", required: true, detail: "Objects of customer and amount. Up to 5,000 per request." },
          { name: "reference", type: "string", detail: "Your own id for the whole run." },
        ],
        sample: `curl ${BASE_URL}/disbursements \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "biller": "mtn_airtime",
    "reference": "field-team-sept",
    "items": [
      { "customer": "08031234567", "amount": 2000 },
      { "customer": "08079876543", "amount": 2000 }
    ]
  }'`,
        response: `{
  "id": "dsb_8Yn3kQw",
  "status": "processing",
  "biller": "mtn_airtime",
  "count": 2,
  "total": 4000,
  "currency": "NGN"
}`,
      },
      {
        method: "GET",
        path: "/billers",
        sdk: { resource: "billers", action: "list", variable: "billers", args: [["category", "electricity"]] },
        summary: "List every biller, with the fields each one needs.",
        params: [
          { name: "category", type: "string", detail: "airtime, data, electricity, cable or internet." },
        ],
        sample: `curl ${BASE_URL}/billers?category=electricity \\
  -H "Authorization: Bearer sk_live_9f2c"`,
        response: `{
  "data": [
    { "code": "ikeja_electric", "name": "Ikeja Electric", "fields": ["meter_number"] },
    { "code": "ekedc", "name": "Eko Electricity", "fields": ["meter_number"] }
  ]
}`,
      },
    ],
  },
  {
    id: "treasury",
    title: "Treasury",
    blurb:
      "Convert gift card balances into naira at a rate quoted before you commit and held once you confirm.",
    endpoints: [
      {
        method: "GET",
        path: "/giftcard_rates",
        sdk: { resource: "giftcardRates", action: "list", variable: "rates", args: [["brand", "steam"]] },
        summary: "Today's rate per brand and region.",
        params: [
          { name: "brand", type: "string", detail: "Filter to one brand." },
        ],
        sample: `curl ${BASE_URL}/giftcard_rates?brand=steam \\
  -H "Authorization: Bearer sk_live_9f2c"`,
        response: `{
  "data": [
    { "brand": "steam", "region": "US", "rate": 1420, "currency": "NGN" },
    { "brand": "steam", "region": "UK", "rate": 1510, "currency": "NGN" }
  ],
  "quoted_for_seconds": 120
}`,
      },
      {
        method: "POST",
        path: "/giftcard_trades",
        sdk: { resource: "giftcardTrades", action: "create", variable: "trade", args: [["brand", "steam"], ["region", "US"], ["value", 100]] },
        summary: "Convert a gift card balance at the quoted rate.",
        params: [
          { name: "brand", type: "string", required: true, detail: "Brand code from /giftcard_rates." },
          { name: "region", type: "string", required: true, detail: "Two-letter region of the gift card." },
          { name: "value", type: "integer", required: true, detail: "Face value, in the gift card's own currency." },
        ],
        sample: `curl ${BASE_URL}/giftcard_trades \\
  -H "Authorization: Bearer sk_live_9f2c" \\
  -d brand=steam \\
  -d region=US \\
  -d value=100`,
        response: `{
  "id": "gct_1Pv6zAx",
  "status": "credited",
  "rate": 1420,
  "credited": 142000,
  "currency": "NGN"
}`,
      },
    ],
  },
];

/* Every delivery has the same envelope, whatever the event. Worth stating once
   here rather than repeating it in fourteen payloads: handlers key off `type`
   and `data`, and `id` is what makes a replay safe to ignore. */
export const WEBHOOK_ENVELOPE = `{
  "id": "evt_8Kd2mWc",
  "type": "deposit.succeeded",
  "created_at": "2026-09-28T14:32:10+01:00",
  "data": { }
}`;

export type WebhookEvent = {
  name: string;
  detail: string;
  /* The full body as it arrives, envelope included. These used to be a name
     and a sentence, which told an integrator what an event meant but not what
     to destructure — so the first thing anyone did was fire a test delivery to
     find out. */
  payload: string;
};

/* Ordered so the first six are exactly the four quickstart steps — journey.tsx
   slices them for its "events you will handle first" list. */
export const WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    name: "user.created",
    detail: "A profile was created, by you or from a payment page.",
    payload: `{
  "id": "evt_1Aa4nPq",
  "type": "user.created",
  "created_at": "2026-09-28T09:14:02+01:00",
  "data": {
    "id": "usr_7Qd2mWc",
    "name": "Ada Obi",
    "phone": "08031234567",
    "reference": "cust-8841",
    "balance": 0,
    "currency": "NGN",
    "identity": "unverified"
  }
}`,
  },
  {
    name: "deposit.succeeded",
    detail: "Money came in and cleared, on any channel.",
    payload: `{
  "id": "evt_8Kd2mWc",
  "type": "deposit.succeeded",
  "created_at": "2026-09-28T14:32:10+01:00",
  "data": {
    "id": "dep_5vN8pLt",
    "status": "succeeded",
    "user": "usr_7Qd2mWc",
    "amount": 45000,
    "fee": 450,
    "net": 44550,
    "currency": "NGN",
    "channel": "transfer",
    "reference": "ord-8841",
    "paid_at": "2026-09-28T14:32:08+01:00"
  }
}`,
  },
  {
    name: "deposit.failed",
    detail: "The payer's bank rejected the transfer, or the code expired.",
    payload: `{
  "id": "evt_3Fp7yLd",
  "type": "deposit.failed",
  "created_at": "2026-09-28T14:41:55+01:00",
  "data": {
    "id": "dep_5vN8pLt",
    "status": "failed",
    "user": "usr_7Qd2mWc",
    "amount": 45000,
    "currency": "NGN",
    "channel": "transfer",
    "reference": "ord-8841",
    "failure": {
      "code": "rail_rejected",
      "message": "Payer's bank declined the transfer."
    }
  }
}`,
  },
  {
    name: "withdrawal.queued",
    detail: "A payout was accepted and is on its way to NIP.",
    payload: `{
  "id": "evt_6Zx1wRt",
  "type": "withdrawal.queued",
  "created_at": "2026-09-28T15:02:19+01:00",
  "data": {
    "id": "wdr_3k9xQm2",
    "status": "queued",
    "amount": 2480000,
    "currency": "NGN",
    "bank_code": "058",
    "bank": "GTBank",
    "account_number": "0123456789",
    "cadence": "instant",
    "rail": "NIP",
    "reference": "TRB-3K9XQM2"
  }
}`,
  },
  {
    name: "withdrawal.paid",
    detail:
      "The receiving bank confirmed the credit. This is the one to reconcile against.",
    payload: `{
  "id": "evt_9Nm5vBc",
  "type": "withdrawal.paid",
  "created_at": "2026-09-28T15:03:47+01:00",
  "data": {
    "id": "wdr_3k9xQm2",
    "status": "paid",
    "amount": 2480000,
    "currency": "NGN",
    "bank": "GTBank",
    "account_number": "0123456789",
    "rail": "NIP",
    "reference": "TRB-3K9XQM2",
    "session_id": "090286260928150341123456789012",
    "paid_at": "2026-09-28T15:03:41+01:00"
  }
}`,
  },
  {
    name: "withdrawal.returned",
    detail: "The rail sent it back — wrong account, dormant account, limit.",
    payload: `{
  "id": "evt_4Hq8jWs",
  "type": "withdrawal.returned",
  "created_at": "2026-09-28T15:21:08+01:00",
  "data": {
    "id": "wdr_3k9xQm2",
    "status": "returned",
    "amount": 2480000,
    "currency": "NGN",
    "bank": "GTBank",
    "reference": "TRB-3K9XQM2",
    "returned_to_balance": true,
    "failure": {
      "code": "rail_rejected",
      "message": "Beneficiary account is dormant."
    }
  }
}`,
  },
  {
    name: "loan.repayment_recorded",
    detail: "A repayment landed, with the new outstanding balance on the payload.",
    payload: `{
  "id": "evt_3Gk7dGe",
  "type": "loan.repayment_recorded",
  "created_at": "2026-09-28T06:00:13+01:00",
  "data": {
    "id": "loan_6Hs1tYv",
    "user": "usr_7Qd2mWc",
    "repayment": "rep_4Rm7cZp",
    "total_repayable": 540000,
    "amount_paid": 351000,
    "amount_remaining": 189000,
    "instalments_paid": 10,
    "instalments_total": 15,
    "due_in_days": 30,
    "status": "on_track"
  }
}`,
  },
  {
    name: "loan.in_arrears",
    detail:
      "An instalment's due date passed with nothing recorded against it. Your cue to go and ask.",
    payload: `{
  "id": "evt_0Ld9sPt",
  "type": "loan.in_arrears",
  "created_at": "2026-09-28T00:05:00+01:00",
  "data": {
    "id": "loan_4Rm7cZp",
    "user": "usr_4Rm7cZp",
    "amount_paid": 90000,
    "amount_remaining": 90000,
    "instalment": 15000,
    "instalments_paid": 6,
    "instalments_total": 12,
    "days_in_arrears": 12,
    "status": "in_arrears"
  }
}`,
  },
  {
    name: "loan.settled",
    detail: "Nothing left to collect.",
    payload: `{
  "id": "evt_8Jy4mNh",
  "type": "loan.settled",
  "created_at": "2026-09-28T06:00:13+01:00",
  "data": {
    "id": "loan_1Pv6zAx",
    "user": "usr_1Pv6zAx",
    "total_repayable": 103500,
    "amount_paid": 103500,
    "amount_remaining": 0,
    "instalments_paid": 9,
    "instalments_total": 9,
    "status": "settled"
  }
}`,
  },
  {
    name: "transfer.completed",
    detail:
      "One user sent money to another. Fires once, and the balance has already moved.",
    payload: `{
  "id": "evt_5Ty2kMn",
  "type": "transfer.completed",
  "created_at": "2026-09-28T19:04:11+01:00",
  "data": {
    "id": "trf_2Bt9xKe",
    "status": "completed",
    "from": "usr_7Qd2mWc",
    "to": "usr_2Kf9pRv",
    "amount": 25000,
    "fee": 0,
    "currency": "NGN",
    "note": "Rent share"
  }
}`,
  },
  {
    name: "disbursement.completed",
    detail: "Every line in a bulk run reached a final state.",
    payload: `{
  "id": "evt_1Qr5tVb",
  "type": "disbursement.completed",
  "created_at": "2026-09-28T08:15:44+01:00",
  "data": {
    "id": "dsb_8Yn3kQw",
    "status": "completed",
    "biller": "mtn_airtime",
    "reference": "field-team-sept",
    "count": 200,
    "succeeded": 198,
    "failed": 2,
    "total": 400000,
    "refunded": 4000,
    "currency": "NGN"
  }
}`,
  },
  {
    name: "giftcard_trade.credited",
    detail: "A gift card balance converted and the naira landed.",
    payload: `{
  "id": "evt_6Ds8pKa",
  "type": "giftcard_trade.credited",
  "created_at": "2026-09-28T17:48:26+01:00",
  "data": {
    "id": "gct_1Pv6zAx",
    "status": "credited",
    "brand": "steam",
    "region": "US",
    "value": 100,
    "rate": 1420,
    "credited": 142000,
    "currency": "NGN"
  }
}`,
  },
];

/* Every failure has the same body, whatever the status. `code` is the thing to
   branch on — `message` is written for a human reading a log and may change. */
export const ERROR_ENVELOPE = `{
  "error": {
    "code": "invalid_request",
    "message": "Written for a human. Do not match on it.",
    "param": "amount",
    "request_id": "req_2Bt9xKe"
  }
}`;

export type ApiError = {
  status: string;
  code: string;
  detail: string;
  /* What comes back on the wire. Knowing a 422 exists is less useful than
     knowing the rail's own reason arrives under `error.rail`. */
  body: string;
};

export const ERRORS: ApiError[] = [
  {
    status: "400",
    code: "invalid_request",
    detail: "A parameter is missing or malformed. The message names it.",
    body: `{
  "error": {
    "code": "invalid_request",
    "message": "amount must be a positive integer of naira, not kobo.",
    "param": "amount",
    "request_id": "req_2Bt9xKe"
  }
}`,
  },
  {
    status: "401",
    code: "unauthenticated",
    detail: "No key, a revoked key, or a test key on a live path.",
    body: `{
  "error": {
    "code": "unauthenticated",
    "message": "This key has been revoked. Issue a new one in the dashboard.",
    "request_id": "req_9Fm3xQt"
  }
}`,
  },
  {
    status: "402",
    code: "insufficient_balance",
    detail: "Not enough in the balance to cover the withdrawal or the run.",
    body: `{
  "error": {
    "code": "insufficient_balance",
    "message": "Balance is ₦1,240,000 and the withdrawal is ₦2,480,000.",
    "available": 1240000,
    "required": 2480000,
    "currency": "NGN",
    "request_id": "req_4Kd8pLw"
  }
}`,
  },
  {
    status: "404",
    code: "not_found",
    detail: "No object with that id under this key.",
    body: `{
  "error": {
    "code": "not_found",
    "message": "No loan with id loan_6Hs1tYv on this account.",
    "param": "loan",
    "request_id": "req_7Bn2vRc"
  }
}`,
  },
  {
    status: "409",
    code: "duplicate_reference",
    detail: "That reference already exists. The original object is on the payload.",
    body: `{
  "error": {
    "code": "duplicate_reference",
    "message": "Reference ord-8841 was already used.",
    "param": "reference",
    "original": {
      "id": "dep_5vN8pLt",
      "status": "succeeded",
      "amount": 45000
    },
    "request_id": "req_1Zx6tMe"
  }
}`,
  },
  {
    status: "422",
    code: "rail_rejected",
    detail: "NIBSS or the bank refused it. The rail's own reason is included.",
    body: `{
  "error": {
    "code": "rail_rejected",
    "message": "Beneficiary account is dormant.",
    "rail": {
      "name": "NIP",
      "code": "A6",
      "message": "DORMANT ACCOUNT"
    },
    "request_id": "req_5Rq9jWs"
  }
}`,
  },
  {
    status: "429",
    code: "rate_limited",
    detail: "Over the per-key limit. Back off for the Retry-After you are given.",
    body: `{
  "error": {
    "code": "rate_limited",
    "message": "100 requests a second per key, bursting to 200.",
    "retry_after_seconds": 2,
    "request_id": "req_3Ty7kNh"
  }
}`,
  },
  {
    status: "500",
    code: "internal_error",
    detail: "Ours. Safe to retry with the same reference.",
    body: `{
  "error": {
    "code": "internal_error",
    "message": "Something failed on our side. Retry with the same reference.",
    "request_id": "req_8Vc4dGe"
  }
}`,
  },
];

export type Bank = {
  code: string;
  name: string;
  slug: string;
  /* Grouping for the bank codes page. The rail does not care, but a reader
     scanning for "the one my customers actually use" does. */
  kind: "commercial" | "merchant" | "fintech";
};

/* Real NIBSS institution codes, for a fictional API.

   This is a working subset, not the register — new microfinance banks and
   wallets are added to NIBSS continually, and a list hardcoded in a marketing
   site is stale the week after it ships. `GET /bank_codes` is the authority;
   `/developers/bank-codes` says so in as many words. */
export const BANK_CODES: Bank[] = [
  { code: "044", name: "Access Bank", slug: "access-bank", kind: "commercial" },
  { code: "063", name: "Access Bank (Diamond)", slug: "access-bank-diamond", kind: "commercial" },
  { code: "023", name: "Citibank Nigeria", slug: "citibank-nigeria", kind: "commercial" },
  { code: "050", name: "Ecobank Nigeria", slug: "ecobank-nigeria", kind: "commercial" },
  { code: "070", name: "Fidelity Bank", slug: "fidelity-bank", kind: "commercial" },
  { code: "011", name: "First Bank of Nigeria", slug: "first-bank-of-nigeria", kind: "commercial" },
  { code: "214", name: "First City Monument Bank", slug: "fcmb", kind: "commercial" },
  { code: "103", name: "Globus Bank", slug: "globus-bank", kind: "commercial" },
  { code: "058", name: "Guaranty Trust Bank", slug: "gtbank", kind: "commercial" },
  { code: "030", name: "Heritage Bank", slug: "heritage-bank", kind: "commercial" },
  { code: "082", name: "Keystone Bank", slug: "keystone-bank", kind: "commercial" },
  { code: "076", name: "Polaris Bank", slug: "polaris-bank", kind: "commercial" },
  { code: "101", name: "Providus Bank", slug: "providus-bank", kind: "commercial" },
  { code: "221", name: "Stanbic IBTC Bank", slug: "stanbic-ibtc-bank", kind: "commercial" },
  { code: "068", name: "Standard Chartered Bank", slug: "standard-chartered-bank", kind: "commercial" },
  { code: "232", name: "Sterling Bank", slug: "sterling-bank", kind: "commercial" },
  { code: "100", name: "SunTrust Bank", slug: "suntrust-bank", kind: "commercial" },
  { code: "032", name: "Union Bank of Nigeria", slug: "union-bank-of-nigeria", kind: "commercial" },
  { code: "033", name: "United Bank for Africa", slug: "uba", kind: "commercial" },
  { code: "215", name: "Unity Bank", slug: "unity-bank", kind: "commercial" },
  { code: "035", name: "Wema Bank", slug: "wema-bank", kind: "commercial" },
  { code: "057", name: "Zenith Bank", slug: "zenith-bank", kind: "commercial" },
  { code: "301", name: "Jaiz Bank", slug: "jaiz-bank", kind: "merchant" },
  { code: "302", name: "TAJBank", slug: "tajbank", kind: "merchant" },
  { code: "50211", name: "Kuda Microfinance Bank", slug: "kuda", kind: "fintech" },
  { code: "50515", name: "Moniepoint Microfinance Bank", slug: "moniepoint", kind: "fintech" },
  { code: "51310", name: "Sparkle Microfinance Bank", slug: "sparkle", kind: "fintech" },
  { code: "51318", name: "FairMoney Microfinance Bank", slug: "fairmoney", kind: "fintech" },
  { code: "999992", name: "OPay", slug: "opay", kind: "fintech" },
  { code: "999991", name: "PalmPay", slug: "palmpay", kind: "fintech" },
];

export const BANK_KINDS = {
  commercial: "Commercial banks",
  merchant: "Non-interest banks",
  fintech: "Microfinance banks and wallets",
} as const;

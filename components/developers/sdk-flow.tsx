"use client";

import { useState } from "react";
import { Band, Container, SectionHead } from "@/components/ui/section";
import { Button, TextLink } from "@/components/ui/button";
import { CodeBlock } from "@/components/developers/code-block";
import { roveTabs } from "@/components/ui/tablist";

/* The SDK section used to be three install lines in three boxes, which told a
   reader a package exists and nothing about what using it looks like.

   This walks the same four calls as the quickstart — keys, a user, money, the
   webhook — in each language, so the choice of SDK is a choice of syntax rather
   than a leap of faith. Laravel and Go replace the bare PHP listing: Laravel is
   how PHP is actually written in Nigerian fintech, and Go is what the people
   asking for a typed client are asking from.

   Client component for the tab state only. The samples are static strings. */
const STEPS = ["Install", "Create a user", "Move money", "Verify the webhook"] as const;

const SDKS = {
  node: {
    label: "Node",
    install: "npm i @tribe/node",
    files: ["tribe.ts", "user.ts", "money.ts", "webhook.ts"],
    samples: [
      `npm i @tribe/node`,
      `import { Tribe } from "@tribe/node";

const tribe = new Tribe(process.env.TRIBE_SECRET_KEY!);

const user = await tribe.users.create({
  name: "Ada Obi",
  phone: "08031234567",
  reference: "cust-8841",
});`,
      `import { Tribe } from "@tribe/node";

const tribe = new Tribe(process.env.TRIBE_SECRET_KEY!);

const deposit = await tribe.deposits.create({
  user: user.id,
  amount: 45_000,
  channel: "transfer",
  reference: "ord-8841",
});

const payout = await tribe.withdrawals.create({
  amount: 2_480_000,
  bankCode: "058",
  accountNumber: "0123456789",
  cadence: "instant",
});`,
      `import { verify } from "@tribe/node";

// Same secret that authenticates your calls — it is what signs the webhook.
const SECRET = process.env.TRIBE_SECRET_KEY!;

app.post("/webhooks/tribe", express.raw({ type: "*/*" }), (req, res) => {
  if (!verify(req.body, req.header("X-Tribe-Signature"), SECRET)) {
    return res.sendStatus(400);
  }

  const event = JSON.parse(req.body);
  if (event.type === "deposit.succeeded") {
    fulfil(event.data.reference);
  }

  res.sendStatus(200);
});`,
    ],
  },
  laravel: {
    label: "Laravel",
    install: "composer require tribe/laravel",
    files: ["terminal", "UserController.php", "PaymentController.php", "routes/web.php"],
    samples: [
      `composer require tribe/laravel
php artisan vendor:publish --tag=tribe-config`,
      `use Tribe\\Laravel\\Facades\\Tribe;

$user = Tribe::users()->create([
    'name'      => 'Ada Obi',
    'phone'     => '08031234567',
    'reference' => 'cust-8841',
]);`,
      `use Tribe\\Laravel\\Facades\\Tribe;

// TRIBE_SECRET_KEY in .env; the service provider reads it for you.

$deposit = Tribe::deposits()->create([
    'user'      => $user->id,
    'amount'    => 45000,
    'channel'   => 'transfer',
    'reference' => 'ord-8841',
]);

$payout = Tribe::withdrawals()->create([
    'amount'         => 2480000,
    'bank_code'      => '058',
    'account_number' => '0123456789',
    'cadence'        => 'instant',
]);`,
      `// The package registers the route and checks the signature for you.
// Listen for the event you care about:

use Tribe\\Laravel\\Events\\DepositSucceeded;

Event::listen(function (DepositSucceeded $event) {
    Order::where('reference', $event->data['reference'])->first()?->fulfil();
});`,
    ],
  },
  python: {
    label: "Python",
    install: "pip install tribe",
    files: ["terminal", "users.py", "money.py", "webhook.py"],
    samples: [
      `pip install tribe`,
      `import os
import tribe

tribe.api_key = os.environ["TRIBE_SECRET_KEY"]

user = tribe.User.create(
    name="Ada Obi",
    phone="08031234567",
    reference="cust-8841",
)`,
      `import os
import tribe

tribe.api_key = os.environ["TRIBE_SECRET_KEY"]

deposit = tribe.Deposit.create(
    user=user.id,
    amount=45_000,
    channel="transfer",
    reference="ord-8841",
)

payout = tribe.Withdrawal.create(
    amount=2_480_000,
    bank_code="058",
    account_number="0123456789",
    cadence="instant",
)`,
      `import os

from flask import request, abort
from tribe import verify

SECRET = os.environ["TRIBE_SECRET_KEY"]

@app.post("/webhooks/tribe")
def webhook():
    if not verify(request.data, request.headers.get("X-Tribe-Signature"), SECRET):
        abort(400)

    event = request.get_json()
    if event["type"] == "deposit.succeeded":
        fulfil(event["data"]["reference"])

    return "", 200`,
    ],
  },
  go: {
    label: "Go",
    install: "go get github.com/tribe-ng/tribe-go",
    files: ["terminal", "user.go", "money.go", "webhook.go"],
    samples: [
      `go get github.com/tribe-ng/tribe-go`,
      `import "github.com/tribe-ng/tribe-go"

client := tribe.New(os.Getenv("TRIBE_SECRET_KEY"))

user, err := client.Users.Create(ctx, &tribe.UserParams{
    Name:      "Ada Obi",
    Phone:     "08031234567",
    Reference: "cust-8841",
})`,
      `import "github.com/tribe-ng/tribe-go"

client := tribe.New(os.Getenv("TRIBE_SECRET_KEY"))

deposit, err := client.Deposits.Create(ctx, &tribe.DepositParams{
    User:      user.ID,
    Amount:    45000,
    Channel:   "transfer",
    Reference: "ord-8841",
})

payout, err := client.Withdrawals.Create(ctx, &tribe.WithdrawalParams{
    Amount:        2480000,
    BankCode:      "058",
    AccountNumber: "0123456789",
    Cadence:       "instant",
})`,
      `// Same secret that authenticates your calls — it is what signs the webhook.
var secret = os.Getenv("TRIBE_SECRET_KEY")

func webhook(w http.ResponseWriter, r *http.Request) {
    body, _ := io.ReadAll(r.Body)

    if !tribe.Verify(body, r.Header.Get("X-Tribe-Signature"), secret) {
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    var event tribe.Event
    json.Unmarshal(body, &event)

    if event.Type == "deposit.succeeded" {
        fulfil(event.Data.Reference)
    }

    w.WriteHeader(http.StatusOK)
}`,
    ],
  },
} as const;

type Lang = keyof typeof SDKS;
const LANGS = Object.keys(SDKS) as Lang[];

export function SdkFlow() {
  const [lang, setLang] = useState<Lang>("node");
  const sdk = SDKS[lang];

  return (
    <Band id="sdks" className="bg-bone">
      <Container>
        <SectionHead
          eyebrow="SDKs"
          title="The same four calls, in your language"
          body="Thin wrappers — the same resources, typed, with the signature check built in. Pick one and the whole quickstart is below it, initialisation included."
        />

        <div
          role="tablist"
          aria-label="SDK language"
          className="mt-10 flex flex-wrap gap-2"
          onKeyDown={(e) =>
            roveTabs(e, LANGS.length, LANGS.indexOf(lang), (n) => setLang(LANGS[n]))
          }
        >
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              tabIndex={lang === l ? 0 : -1}
              onClick={() => setLang(l)}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                lang === l
                  ? "bg-brand text-white"
                  : "border border-line bg-white text-ink hover:border-brand/40 hover:bg-brand-soft"
              }`}
            >
              {SDKS[l].label}
            </button>
          ))}
        </div>

        <p className="mt-6 font-mono text-[13px] text-muted">{sdk.install}</p>

        <ol className="mt-8 space-y-10">
          {STEPS.map((title, i) => (
            <li
              key={title}
              className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12"
            >
              <div>
                <p className="display tnum text-[1.75rem] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="heading mt-1 text-lg">{title}</h3>
              </div>
              <CodeBlock
                code={sdk.samples[i]}
                label={sdk.files[i]}
                copyLabel={`Copy the ${sdk.label} ${title.toLowerCase()} sample`}
                className="min-w-0"
              />
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8">
          <h3 className="heading text-xl">Every endpoint, in the same four</h3>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">
            The reference carries this per resource: under the cURL for each
            endpoint is the same call through the SDK, in whichever of the four
            you pick — and the choice follows you down the page.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href="/developers/api" size="lg">
              Open the API reference
            </Button>
            <TextLink href="/developers#quickstart">Or do it over plain HTTP</TextLink>
          </div>
        </div>
      </Container>
    </Band>
  );
}

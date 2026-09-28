/* One SDK call, described once, rendered in four languages.

   Writing eighty samples by hand would mean eighty chances for Node and Go to
   drift apart on the same endpoint — the exact failure `api-data.ts` exists to
   prevent for the cURL samples. An endpoint declares what it calls and with
   what, and the four renderings come from that.

   **Every sample initialises the client.** A snippet that opens on
   `tribe.users.create(...)` assumes the reader already knows where the key
   goes, which is the one thing someone reaching for an SDK sample does not yet
   know. Two extra lines per sample is a cheap price for never having to say
   "see the quickstart for setup". */

export type SdkArgs = [name: string, value: string | number][];

export type SdkCall = {
  /* The plural resource on the client: tribe.users, client.Withdrawals. */
  resource: string;
  action: "create" | "retrieve" | "list";
  /* What the result is called in the sample. */
  variable: string;
  args?: SdkArgs;
  /* A path id, for retrieve and for nested creates. */
  id?: string;
  /* A nested collection, e.g. loans/{id}/repayments. */
  nested?: string;
};

export const SDK_LANGS = ["node", "laravel", "python", "go"] as const;
export type SdkLang = (typeof SDK_LANGS)[number];

export const SDK_LABEL: Record<SdkLang, string> = {
  node: "Node",
  laravel: "Laravel",
  python: "Python",
  go: "Go",
};

export const SDK_FILE: Record<SdkLang, string> = {
  node: "tribe.ts",
  laravel: "Tribe.php",
  python: "tribe_client.py",
  go: "tribe.go",
};

const camel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
const pascal = (s: string) => {
  const c = camel(s);
  return c.charAt(0).toUpperCase() + c.slice(1);
};

/* "users" -> "Users", "payment_links" -> "PaymentLinks". */
const goResource = (s: string) => pascal(s);
/* Python exposes a class per resource: users -> User, giftcard_rates -> GiftcardRate. */
const pyClass = (s: string) => pascal(s.replace(/ies$/, "y").replace(/s$/, ""));

const quote = (v: string | number, q: '"' | "'") =>
  typeof v === "number" ? String(v) : `${q}${v}${q}`;

const pad = (rows: [string, string][]) => {
  const width = Math.max(0, ...rows.map(([k]) => k.length));
  return rows.map(([k, v]) => [k.padEnd(width), v] as [string, string]);
};

function node(call: SdkCall): string {
  const head = `import { Tribe } from "@tribe/node";

const tribe = new Tribe(process.env.TRIBE_SECRET_KEY!);
`;
  const target = call.nested
    ? `tribe.${call.resource}.${call.nested}`
    : `tribe.${call.resource}`;

  if (call.action === "retrieve") {
    return `${head}
const ${call.variable} = await ${target}.retrieve("${call.id}");`;
  }

  const args = (call.args ?? []).map(
    ([k, v]) => `  ${camel(k)}: ${quote(v, '"')},`,
  );

  if (call.action === "list") {
    return args.length
      ? `${head}
const ${call.variable} = await ${target}.list({
${args.join("\n")}
});`
      : `${head}
const ${call.variable} = await ${target}.list();`;
  }

  const first = call.id ? `  ${call.nested ? "loan" : "id"}: "${call.id}",\n` : "";
  return `${head}
const ${call.variable} = await ${target}.create({
${first}${args.join("\n")}
});`;
}

function laravel(call: SdkCall): string {
  const head = `use Tribe\\Laravel\\Facades\\Tribe;

// TRIBE_SECRET_KEY in .env; the service provider reads it for you.
`;
  const target = call.nested
    ? `Tribe::${call.resource}()->${call.nested}()`
    : `Tribe::${call.resource}()`;
  const v = `$${camel(call.variable)}`;

  if (call.action === "retrieve") {
    return `${head}
${v} = ${target}->retrieve('${call.id}');`;
  }

  const rows = pad((call.args ?? []).map(([k, val]) => [`'${k}'`, quote(val, "'")]));
  const args = rows.map(([k, val]) => `    ${k} => ${val},`);

  if (call.action === "list") {
    return args.length
      ? `${head}
${v} = ${target}->list([
${args.join("\n")}
]);`
      : `${head}
${v} = ${target}->list();`;
  }

  const first = call.id
    ? `    ${`'${call.nested ? "loan" : "id"}'`.padEnd(rows[0]?.[0].length ?? 0)} => '${call.id}',\n`
    : "";
  return `${head}
${v} = ${target}->create([
${first}${args.join("\n")}
]);`;
}

function python(call: SdkCall): string {
  const head = `import os
import tribe

tribe.api_key = os.environ["TRIBE_SECRET_KEY"]
`;
  const cls = pyClass(call.resource);
  const target = call.nested ? `tribe.${cls}.${call.nested}` : `tribe.${cls}`;

  if (call.action === "retrieve") {
    return `${head}
${call.variable} = ${target}.retrieve("${call.id}")`;
  }

  const args = (call.args ?? []).map(([k, v]) => `    ${k}=${quote(v, '"')},`);

  if (call.action === "list") {
    return args.length
      ? `${head}
${call.variable} = ${target}.list(
${args.join("\n")}
)`
      : `${head}
${call.variable} = ${target}.list()`;
  }

  const first = call.id ? `    ${call.nested ? "loan" : "id"}="${call.id}",\n` : "";
  return `${head}
${call.variable} = ${target}.create(
${first}${args.join("\n")}
)`;
}

function go(call: SdkCall): string {
  const head = `import "github.com/tribe-ng/tribe-go"

client := tribe.New(os.Getenv("TRIBE_SECRET_KEY"))
`;
  const res = goResource(call.resource);
  const target = call.nested
    ? `client.${res}.${pascal(call.nested)}`
    : `client.${res}`;
  const v = camel(call.variable);

  if (call.action === "retrieve") {
    return `${head}
${v}, err := ${target}.Retrieve(ctx, "${call.id}")`;
  }

  /* Nested creates take the nested resource's params, not the parent's:
     client.Loans.Repayments.Create takes RepaymentParams. */
  const paramType = `tribe.${pyClass(call.nested ?? call.resource)}Params`;

  /* gofmt aligns the values, not the colons — `Loan:    "x"`, never
     `Loan   : "x"` — so the padding goes on the key *including* its colon. */
  const rows = pad(
    (call.args ?? []).map(([k, val]) => [`${pascal(k)}:`, quote(val, '"')]),
  );
  const args = rows.map(([k, val]) => `    ${k} ${val},`);

  if (call.action === "list") {
    return args.length
      ? `${head}
${v}, err := ${target}.List(ctx, &${paramType}{
${args.join("\n")}
})`
      : `${head}
${v}, err := ${target}.List(ctx, nil)`;
  }

  const first = call.id
    ? `    ${`${call.nested ? "Loan" : "ID"}:`.padEnd(rows[0]?.[0].length ?? 0)} "${call.id}",\n`
    : "";
  return `${head}
${v}, err := ${target}.Create(ctx, &${paramType}{
${first}${args.join("\n")}
})`;
}

const RENDER: Record<SdkLang, (call: SdkCall) => string> = {
  node,
  laravel,
  python,
  go,
};

export function renderSdk(lang: SdkLang, call: SdkCall): string {
  return RENDER[lang](call);
}

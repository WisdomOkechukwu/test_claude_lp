import { Band, Container, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import {
  Bank,
  Clock,
  Fingerprint,
  Lock,
  Receipt,
  Repeat,
  ShieldCheck,
  Split,
  Users,
  Vault,
} from "@/components/ui/icons";

/* One shape, four sections. Each is a heading, a paragraph of context and a
   definition list — the same dl-with-the-icon-inside-the-dt pattern the rest
   of the site uses (see loan-collection.tsx for why the icon cannot sit beside
   the wrapper). */
type Point = { icon: typeof Lock; title: string; body: string };

function Practice({
  id,
  eyebrow,
  title,
  body,
  points,
  bone = false,
  cta,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: Point[];
  bone?: boolean;
  cta?: { label: string; href: string };
}) {
  return (
    <Band id={id} className={bone ? "bg-bone" : undefined}>
      <Container>
        <div className="max-w-[52ch]">
          <Eyebrow className="text-brand">{eyebrow}</Eyebrow>
          <h2 className="heading display-section">{title}</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">{body}</p>
        </div>

        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {points.map(({ icon: Icon, title: t, body: b }) => (
            <div key={t}>
              <dt className="flex items-center gap-4 font-semibold">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                {t}
              </dt>
              <dd className="mt-1 max-w-[48ch] pl-[60px] text-[15px] leading-relaxed text-muted">
                {b}
              </dd>
            </div>
          ))}
        </dl>

        {cta && (
          <Button href={cta.href} variant="secondary" size="lg" className="mt-10">
            {cta.label}
          </Button>
        )}
      </Container>
    </Band>
  );
}

export function SecurityPractices() {
  return (
    <>
      <Practice
        id="rails"
        eyebrow="How money moves"
        title="One way in, one way out, and a reference on both"
        body="Every naira arrives as a deposit and leaves as a withdrawal. There is no third path, which is the point — a single pair of movements is a small surface to watch and a short list to reconcile."
        bone
        points={[
          {
            icon: Bank,
            title: "Payouts go over NIBSS Instant Payment",
            body: "The same rail your bank app uses. Nothing leaves on an internal transfer we invented, so a payout you cannot see in your statement is a payout that did not happen.",
          },
          {
            icon: Receipt,
            title: "Every movement carries a reference",
            body: "Generated on our side, echoed by the rail, and printed on your statement line. Reconciliation is a join on one column rather than a matching exercise on amounts and dates.",
          },
          {
            icon: Split,
            title: "Two approvers above a threshold",
            body: "Set the figure yourself. Above it, a payout waits for a second person — including one raised by the API, which cannot approve its own request.",
          },
          {
            icon: Clock,
            title: "Nothing is irreversible without a pause",
            body: "A queued withdrawal can be cancelled until the rail accepts it, and a bulk run can be stopped mid-flight. What has already settled is reported, not quietly undone.",
          },
        ]}
      />

      <Practice
        id="access"
        eyebrow="Accounts and access"
        title="Your intern cannot move a million naira"
        body="Most losses are not break-ins. They are someone inside doing something they were never meant to be able to do, and nobody noticing for a fortnight."
        points={[
          {
            icon: Users,
            title: "Roles, not shared logins",
            body: "Every person gets their own sign-in with their own limit. Viewing, raising and approving are three separate permissions, and one account can hold fewer than all three.",
          },
          {
            icon: Lock,
            title: "Two-factor on every device",
            body: "A new device is a new approval, not a silent sign-in. Sessions can be listed and ended from the dashboard, including the one you are reading it on.",
          },
          {
            icon: Receipt,
            title: "An audit trail you cannot edit",
            body: "Who raised it, who approved it, from which device, and what changed. Exportable, append-only, and kept when a staff member leaves.",
          },
          {
            icon: Clock,
            title: "Access ends when employment does",
            body: "Revoking a person revokes their sessions and their keys immediately, rather than at the next sign-in.",
          },
        ]}
      />

      <Practice
        id="identity"
        eyebrow="Identity"
        title="The person you paid is the person you meant to pay"
        body="Tribe never debits anybody — money only ever leaves because someone here asked it to. What matters, then, is that the destination is who you think it is."
        bone
        points={[
          {
            icon: Fingerprint,
            title: "BVN and NIN matched before you lend",
            body: "The name on the bank account has to agree with the identity on the profile. A mismatch fails at creation rather than at the first missed instalment.",
          },
          {
            icon: Repeat,
            title: "A cashpoint resolves to a name first",
            body: "Twenty digits identify a user without exposing a bank account, and the name comes back before the transfer goes out — so a wrong digit is a wrong name, not a wrong payment.",
          },
          {
            icon: ShieldCheck,
            title: "Payout accounts are verified before they are used",
            body: "A new withdrawal destination is name-checked against the account number, and the first payout to it can be held for approval.",
          },
          {
            icon: Vault,
            title: "Identity is on the user, not the payment",
            body: "One verified profile serves every deposit, transfer and loan that person holds — so there is one record to correct if something is wrong.",
          },
        ]}
      />

      <Practice
        id="api"
        eyebrow="Keys and integrations"
        title="A leaked key should be boring"
        body="Most integrations are compromised through a key in a repository or a webhook handler that trusted whatever arrived. Both are avoidable, and both are your side of the line."
        cta={{ label: "Security notes for engineers", href: "/developers#security" }}
        points={[
          {
            icon: Lock,
            title: "Test and live are different keys",
            body: "Prefixed sk_test_ and sk_live_ so the wrong one is obvious in a diff. A test key on a live path is a 401, not a surprise payout.",
          },
          {
            icon: Repeat,
            title: "Rotation without downtime",
            body: "Issue the replacement, run both while you deploy, revoke the old one. Nothing has to be taken offline to change a secret.",
          },
          {
            icon: ShieldCheck,
            title: "Webhooks are signed, and worth checking",
            body: "HMAC-SHA512 over the raw body in an X-Tribe-Signature header. Compare it in constant time against the bytes as they arrived, not the parsed object.",
          },
          {
            icon: Bank,
            title: "Allowlist the addresses you call from",
            body: "A live secret key can be pinned to your own servers, which makes a key lifted from a log useless anywhere else.",
          },
        ]}
      />
    </>
  );
}

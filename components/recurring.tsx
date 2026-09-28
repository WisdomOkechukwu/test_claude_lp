import { Button, TextLink } from "@/components/ui/button";
import { GetAppButton } from "@/components/ui/get-app-button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { RecurringUtilities } from "@/components/mockups/recurring-utilities";
import { Bolt, Clock, Repeat, ShieldCheck } from "@/components/ui/icons";

const COPY = {
  personal: {
    eyebrow: "Recurring utilities",
    heading: "Set your bills once and stop thinking about them",
    body: "Airtime on Mondays, the meter on the 1st, DSTV before it cuts out mid-match. Tell Tribe what recurs and how often, and it runs on its own from the same balance.",
    cta: "Download the app to explore",
    href: "/customers#bills",
    link: null,
    points: [
      {
        icon: Repeat,
        title: "Weekly, monthly or quarterly",
        body: "Each bill keeps its own rhythm. Airtime can run weekly while the meter runs monthly.",
      },
      {
        icon: Clock,
        title: "A warning before it runs",
        body: "A reminder the day before, and a receipt the moment it clears. Pause or skip any run from the app.",
      },
      {
        icon: ShieldCheck,
        title: "Never overdrawn",
        body: "If your balance is short, the run is skipped and you are told — not retried until something breaks.",
      },
    ],
  },
  business: {
    eyebrow: "Recurring utilities",
    heading: "Branch bills that pay themselves every month",
    body: "Three warehouses, nine offices and a field team all need their meters, data and subscriptions kept alive. Schedule them once and let the run handle it, with one receipt per cycle for your books.",
    cta: "Create an account to start",
    href: "/#how-it-works",
    link: { label: "See how our disbursement API works", href: "/developers/api#disbursement" },
    points: [
      {
        icon: Repeat,
        title: "One schedule per location",
        body: "Each meter, line and subscription keeps its own cadence and its own cost centre.",
      },
      {
        icon: Bolt,
        title: "Nothing gets cut off",
        body: "No more a branch losing light because a renewal sat in somebody's inbox.",
      },
      {
        icon: ShieldCheck,
        title: "Approval limits still apply",
        body: "A recurring run above your threshold still waits for a second approver before it moves.",
      },
    ],
  },
} as const;

export function Recurring({
  audience = "personal",
}: {
  audience?: keyof typeof COPY;
}) {
  const c = COPY[audience];

  return (
    <Band id="recurring" className="bg-bone">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              {c.heading}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-muted">{c.body}</p>
            {/* Icon inside the dt — see loan-collection.tsx for why. 40px chip
                plus a 16px gap, so the body indents by 56px here. */}

            <dl className="mt-10 space-y-6">
              {c.points.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <dt className="flex items-center gap-4 font-semibold">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    {title}
                  </dt>
                  <dd className="mt-1 max-w-[44ch] pl-[56px] text-[15px] leading-relaxed text-muted">
                    {body}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* The personal side is an app action, so it routes to whichever
                  store fits the platform rather than to a page. The business
                  side opens an account and stays on the site. */}
              {audience === "personal" ? (
                <GetAppButton size="lg">{c.cta}</GetAppButton>
              ) : (
                <Button href={c.href} size="lg">
                  {c.cta}
                </Button>
              )}
              {c.link && <TextLink href={c.link.href}>{c.link.label}</TextLink>}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RecurringUtilities />
          </div>
        </div>
      </Container>
    </Band>
  );
}

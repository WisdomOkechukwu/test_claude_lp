import Link from "next/link";
import { Container } from "@/components/ui/section";
import { Logo } from "@/components/ui/logo";
import { InstagramLogo, LinkedinLogo, XLogo } from "@/components/ui/icons";

/* Links that lead somewhere real carry an href. The rest are "#" because the
   page does not exist yet — this is a demo site, and a dead link that looks
   live is worse than one that obviously goes nowhere. */
type FooterLink = string | readonly [label: string, href: string];

const COLUMNS: { title: string; links: readonly FooterLink[] }[] = [
  {
    title: "Company",
    links: [ ["About Tribe", "/about"], ["Careers", "/careers"], ["Security", "/security"], ["Service status", "/status"], "Help centre",
    ],
  },
  {
    title: "Products",
    links: [ ["Collections", "/#collections"], ["Withdrawals and settlement", "/#settlement"], ["Loan tracking", "/#loans"], ["Bulk disbursement", "/#disbursement"], ["Treasury", "/#treasury"], ["Vaults", "/developers/api#settlement"], ["Internal transfers", "/developers/api#transfers"],
    ],
  },
  {
    title: "Developers",
    links: [ ["API reference", "/developers/api"], ["Quickstart", "/developers"], ["Webhook events", "/developers/api#webhooks"], ["Error codes", "/developers/api#errors"], ["Sandbox and test keys", "/developers#keys"], ["Tribe SDKs", "/developers#sdks"], ["Bank codes", "/developers/bank-codes"], ["Security notes", "/developers#security"], ["Report a vulnerability", "/security#disclosure"],
    ],
  },
];

const SOCIALS = [
  { label: "Tribe on X", Icon: XLogo },
  { label: "Tribe on Instagram", Icon: InstagramLogo },
  { label: "Tribe on LinkedIn", Icon: LinkedinLogo },
] as const;

const LEGAL = ["Privacy policy", "Terms of service"] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-16 pt-16">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-[15px] font-bold">{col.title}</h2>
              <ul className="space-y-2.5">
                {col.links.map((l) => {
                  const [label, href] = typeof l === "string" ? [l, "#"] : l;
                  return (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[15px] text-muted underline decoration-line underline-offset-4 hover:text-brand hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {label}
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-[15px] font-bold">Follow us</h2>
            <ul className="flex gap-4">
              {SOCIALS.map(({ label, Icon }) => (
                <li key={label}>
                  <Link
                    href="#"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[28ch] text-[15px] text-muted">
              Port Harcourt, Nigeria. Support in English, Pidgin, Hausa, Igbo and
              Yoruba.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-10">
          <Link href="/" className="focus-visible:outline-2 focus-visible:outline-offset-4">
            <Logo className="h-11" />
          </Link>
          <p className="text-[15px] text-muted">© Tribe 2026</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:ml-auto">
            {LEGAL.map((l) => (
              <li key={l}>
                <Link
                  href="#"
                  className="text-[15px] text-muted underline decoration-line underline-offset-4 hover:text-brand hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

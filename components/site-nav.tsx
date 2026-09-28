"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GetAppButton, useAppStoreHref } from "@/components/ui/get-app-button";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/section";
import { Close, Menu } from "@/components/ui/icons";

/* The two audiences are separate pages, not a toggle over one page — a
   customer and a finance lead are looking for different products, not
   different wording for the same one. */
const AUDIENCES = [
  { label: "Customers", href: "/customers" },
  { label: "Business", href: "/" },
] as const;

/* No `hasMenu` any more. Two of these carried a ChevronDown that promised a
   dropdown, and there was never a dropdown behind it — on mobile the chevron
   was dropped entirely, so the affordance was wrong on every viewport. */
const LINKS = {
  customers: [
    { label: "Send money", href: "/customers#transfers" },
    { label: "Cashpoints", href: "/customers#cashpoints" },
    { label: "Bills", href: "/customers#bills" },
    { label: "Giftcards", href: "/customers#giftcards" },
  ],
  business: [
    { label: "Products", href: "/#collections" },
    { label: "Developers", href: "/developers" },
    { label: "Pricing", href: "/#coverage" },
    { label: "Security", href: "/security" },
  ],
} as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const appHref = useAppStoreHref();

  /* Close the drawer when the route changes.

     Every link inside it already calls setOpen(false), so this is really for a
     back/forward navigation, where nothing was clicked. Done as a render-time
     adjustment rather than an effect: setState inside an effect body schedules
     a second render pass and `react-hooks/set-state-in-effect` rightly rejects
     it. This is React's documented "adjusting state when a prop changes"
     pattern — it re-renders before anything is committed to the DOM, so the
     open drawer never paints on the new page. */
  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (pathname !== routeAtOpen) {
    setRouteAtOpen(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const isCustomers = pathname?.startsWith("/customers") ?? false;
  const navLinks = isCustomers ? LINKS.customers : LINKS.business;
  const cta = isCustomers ? "Create a free account" : "Get started";


  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <Container>
        <nav className="flex h-[80px] items-center gap-6" aria-label="Primary">
          <Link
            href="/"
            className="focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 rounded-full bg-bone p-1 md:flex">
            {AUDIENCES.map((a) => {
              const active =
                a.href === "/customers" ? isCustomers : !isCustomers;
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    active
                      ? "bg-white text-brand shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {a.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="flex items-center gap-1 text-sm font-semibold hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={appHref}
              className="text-sm font-semibold hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Download the app
            </Link>
            {/* The customer CTA is an app download and routes to whichever
                store fits the platform; the business one opens an account and
                stays on the site. */}
            {isCustomers ? (
              <GetAppButton className="px-5 text-sm">{cta}</GetAppButton>
            ) : (
              <Button href="/#how-it-works" className="px-5 text-sm">
                {cta}
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-auto grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 lg:hidden"
          >
            {open ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {open && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            <div className="mb-2 flex gap-1 rounded-full bg-bone p-1 md:hidden">
              {AUDIENCES.map((a) => {
                const active =
                  a.href === "/customers" ? isCustomers : !isCustomers;
                return (
                  <Link
                    key={a.label}
                    href={a.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-center text-sm font-semibold ${
                      active ? "bg-white text-brand shadow-sm" : "text-muted"
                    }`}
                  >
                    {a.label}
                  </Link>
                );
              })}
            </div>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-2 py-3 font-semibold hover:bg-ink/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={appHref}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-xl px-2 py-3 font-semibold hover:bg-ink/5"
            >
              Download the app
            </Link>
            {isCustomers ? (
              <GetAppButton className="mt-2">{cta}</GetAppButton>
            ) : (
              <Button href="/#how-it-works" className="mt-2">
                {cta}
              </Button>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}

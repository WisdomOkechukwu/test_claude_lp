import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BrandSprite } from "@/components/brand-sprite";

/* Poppins is not a variable font on Google Fonts, so every weight the design
   uses has to be requested explicitly — and every weight listed here is
   preloaded, which puts it on the critical path.

   500 was dropped: it had five call sites against ninety for 600, and each
   weight is another preloaded request competing for bandwidth on a slow
   connection. Those five now use 600. Do not add a weight back without a real
   need for it.

   `display: swap`, not `optional`. `optional` has been tried twice now,
   because the h1 is the LCP element and in theory committing to the fallback
   should decouple LCP from font arrival. Measured over five runs with real
   throttling it came out at LCP 2704ms against swap's 2700ms — identical. A
   single Lighthouse run showed it a lot better, but Lighthouse's simulated
   throttling is noisy enough to produce 85 and 90 for the same build, and the
   median of three came back level. Not worth costing a first-time visitor the
   brand typeface for nothing. Do not try it a third time without a
   multi-run measurement. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

/* Powers the request/response samples in the developer console.

   NOT preloaded, deliberately. As a variable face it is 39.5KB — on its own it
   was 51% of every preloaded font byte on the page, and it was loading on all
   three routes while being used by exactly one component
   (`mockups/developer-console.tsx`) that only renders on `/`, thousands of
   pixels below the fold. With `display: swap` the code samples paint in the
   fallback mono and swap when the face arrives, which nobody is scrolled far
   enough to witness. Measured worth ~600ms of LCP on a slow connection. */
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tribe.ng"),
  title: {
    default: "Tribe — Collections, settlement and loan recovery for Nigerian businesses",
    template: "%s · Tribe",
  },
  description: "Collect by payment link, bank transfer and NQR. Withdraw into any Nigerian bank account the same day. Track every loan you have given out. One API and one dashboard, built for engineers and operators alike.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Tribe — Built for Nigerian business",
    description: "Collections, same-day withdrawals and loan recovery on Nigerian rails.",
    type: "website",
    locale: "en_NG",
    siteName: "Tribe",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tribe — Built for Nigerian business",
    description: "Collections, same-day withdrawals and loan recovery on Nigerian rails.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/* Structured data for the organisation and the site itself.

   Two things this must not do, both from CLAUDE.md: never name a regulator or
   imply a licence, and never let the demo read as a real financial service.
   `disambiguatingDescription` carries the same framing as the disclaimer
   component so a crawler that surfaces this cannot present Tribe as live.

   There is no `Product`/`Offer` node on purpose — the fees on the page are
   illustrative, and marking them up as offers would publish invented prices
   as structured commercial data. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://tribe.ng/#organization",
      name: "Tribe",
      url: "https://tribe.ng/",
      description:
        "Collections, same-day withdrawals, loan recovery and bulk disbursement for Nigerian businesses, settling on NIBSS rails in naira.",
      disambiguatingDescription:
        "Tribe is a demonstration product built for this website. It is not a live financial service, is not a licensed or regulated financial product, and is not affiliated with NIBSS or any named bank or biller.",
      areaServed: { "@type": "Country", name: "Nigeria" },
    },
    {
      "@type": "WebSite",
      "@id": "https://tribe.ng/#website",
      url: "https://tribe.ng/",
      name: "Tribe",
      inLanguage: "en-NG",
      publisher: { "@id": "https://tribe.ng/#organization" },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-NG"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${jetbrains.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          /* Serialised from a literal we control — no user input reaches it. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-ink">
        {/* Gift card brand geometry, defined once and referenced by id from
            every card — see the note in brand-logos.tsx. */}
        <BrandSprite />
        {children}
      </body>
    </html>
  );
}

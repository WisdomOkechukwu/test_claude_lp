import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { PaymentLinks } from "@/components/payment-links";
import { BusinessSettlement } from "@/components/business-settlement";
import { LoanCollection } from "@/components/loan-collection";
import { BuiltForBoth } from "@/components/built-for-both";
import { EaseOfUse } from "@/components/ease-of-use";
import { Utilities } from "@/components/utilities";
import { Recurring } from "@/components/recurring";
import { Coverage } from "@/components/coverage";
import { GiftcardMarquee } from "@/components/giftcard-marquee";
import { Giftcards } from "@/components/giftcards";
import { Testimonials } from "@/components/testimonials";
import { MissionBanner } from "@/components/mission-banner";
import { SecuritySection } from "@/components/security-section";
import { SiteFooter } from "@/components/site-footer";

/* The layout's default title already describes this page, so only the pieces
   that have to be page-specific are set here. Without the canonical, every
   route resolved to no canonical at all. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <PaymentLinks />
        <BusinessSettlement />
        <LoanCollection />
        <EaseOfUse />
        <Utilities />
        <Recurring audience="business" />
        <GiftcardMarquee />
        <Giftcards />
        {/* The two doors and the price sit after the product, not in the
            middle of it — you cannot judge either until you know what Tribe
            actually does. */}
        <BuiltForBoth />
        <Coverage />
        <Testimonials />
        <MissionBanner />
        <SecuritySection />
      </main>
      <SiteFooter />
    </div>
  );
}

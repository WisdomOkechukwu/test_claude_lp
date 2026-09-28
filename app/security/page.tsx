import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SecurityHero } from "@/components/security/hero";
import { SecurityPractices } from "@/components/security/practices";
import { SecurityData } from "@/components/security/data";
import { SecurityDisclosure } from "@/components/security/disclosure";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/security" },
  title: "Security",
  description:
    "How Tribe keeps money where you sent it: NIP rails with a reference on every movement, approval limits and an audit trail, BVN and NIN matched before you lend, signed webhooks, and no card data because Tribe does not accept cards.",
};

export default function SecurityPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <SecurityHero />
        <SecurityPractices />
        <SecurityData />
        <SecurityDisclosure />
      </main>
      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { DeveloperJourney } from "@/components/developers/journey";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/developers" },
  title: "Developers",
  description:
    "One REST API over Nigerian rails. Users, deposits by link, bank transfer and NQR, withdrawals on NIP, internal transfers between users, loan tracking and bulk disbursement — with a sandbox, signed webhooks and the Tribe SDKs.",
};

export default function DevelopersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <DeveloperJourney />
      </main>
      <SiteFooter />
    </div>
  );
}

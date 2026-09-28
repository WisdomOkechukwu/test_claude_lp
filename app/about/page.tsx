import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { AboutHero } from "@/components/about/hero";
import { AboutValues } from "@/components/about/values";
import { MissionBanner } from "@/components/mission-banner";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: "Tribe was built in Port Harcourt for the way money actually moves in Nigeria — collections, settlement and loan tracking on local rails, built rails-first.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <AboutHero />
        <AboutValues />
        <MissionBanner />
      </main>
      <SiteFooter />
    </div>
  );
}

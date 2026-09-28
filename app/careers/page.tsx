import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import {
  CareersApply,
  CareersHero,
  CareersProcess,
  CareersRoles,
  CareersWhy,
} from "@/components/careers/page-sections";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers",
  description:
    "Engineering, risk and support roles at Tribe in Port Harcourt and remote across Nigeria — what the work is like, what is open, and how we hire.",
};

export default function CareersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <CareersHero />
        <CareersWhy />
        <CareersRoles />
        <CareersProcess />
        <CareersApply />
      </main>
      <SiteFooter />
    </div>
  );
}

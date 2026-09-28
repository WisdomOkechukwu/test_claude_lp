import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { ApiReference } from "@/components/developers/reference";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/developers/api" },
  title: "API reference",
  description:
    "Every Tribe endpoint: users, deposits by link, bank transfer and NQR; withdrawals on NIP; cashpoints and internal transfers; loan positions; bulk disbursement and treasury. With webhook events, error codes and NIBSS bank codes.",
};

export default function ApiReferencePage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <ApiReference />
      </main>
      <SiteFooter />
    </div>
  );
}

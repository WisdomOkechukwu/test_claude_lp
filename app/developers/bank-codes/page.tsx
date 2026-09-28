import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { BankCodes } from "@/components/developers/bank-codes";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/developers/bank-codes" },
  title: "Bank codes",
  description:
    "NIBSS institution codes for Nigerian banks, microfinance banks and wallets — searchable, with the whole list as copyable JSON in the shape GET /bank_codes returns.",
};

export default function BankCodesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <BankCodes />
      </main>
      <SiteFooter />
    </div>
  );
}

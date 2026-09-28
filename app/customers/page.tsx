import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { CustomerHero } from "@/components/customers/hero";
import { CustomerTransfers } from "@/components/customers/transfers";
import { CustomerCashpoints } from "@/components/customers/cashpoints";
import { CustomerBills } from "@/components/customers/bills";
import { Recurring } from "@/components/recurring";
import { GiftcardMarquee } from "@/components/giftcard-marquee";
import { CustomerGiftcards } from "@/components/customers/giftcards";
import { Testimonials, type Quote } from "@/components/testimonials";
import { SecuritySection } from "@/components/security-section";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/customers" },
  title: "Send money, pay bills and sell giftcards",
  description: "Send to any Nigerian bank in seconds for ₦0, or make a cashpoint PIN anyone can redeem. Pay airtime, data, electricity and cable from one balance. Turn giftcard balances into naira at a rate you see first.",
};

const CUSTOMER_QUOTES: Quote[] = [
  {
    quote: "I sent money to my sister at 11pm on a Sunday and it landed before I put the phone down. My old bank would have queued it till Monday.",
    name: "Bisi, Ibadan",
    cta: "Teacher · Ibadan",
  },
  {
    quote: "Airtime, DSTV and the meter all get paid on the first of the month from one screen. I used to keep three apps for that.",
    name: "Tunde, Port Harcourt",
    cta: "Trader · Port Harcourt",
  },
  {
    quote: "The giftcard rate is on the screen before I commit, and the payout hit my balance while I was still on the page.",
    name: "Zainab, reseller",
    cta: "Reseller · Port Harcourt",
  },
  {
    quote: "₦0 on transfers actually means ₦0. I checked the statement for a month before I believed it.",
    name: "Emeka, Abuja",
    cta: "Engineer · Abuja",
  },
];

export default function CustomersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <CustomerHero />
        <CustomerTransfers />
        <CustomerCashpoints />
        <CustomerBills />
        <Recurring />
        <GiftcardMarquee />
        <CustomerGiftcards />
        <Testimonials
          heading="Why people keep their money here"
          quotes={CUSTOMER_QUOTES}
        />
        <SecuritySection />
      </main>
      <SiteFooter />
    </div>
  );
}

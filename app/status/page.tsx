import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { StatusBoard } from "@/components/status/board";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/status" },
  title: "Service status",
  description:
    "Live state for the Tribe API, dashboard and customer app, with ninety days of history and every recent incident written up in full.",
};

export default function StatusPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1">
        <StatusBoard />
      </main>
      <SiteFooter />
    </div>
  );
}

import { TextLink } from "@/components/ui/button";
import { GetAppButton } from "@/components/ui/get-app-button";
import { Container } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";
import { PersonalPhone } from "@/components/mockups/personal-phone";
import { Check } from "@/components/ui/icons";

const PROMISES = [ "₦0 to send money to any Nigerian bank", "Airtime, data, electricity and cable in two taps", "Giftcard balances turned into naira at a rate you see first",
];

export function CustomerHero() {
  return (
    <section className="overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
      <Container className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Free to open, free to send
        </p>

        <h1 className="display mx-auto mt-7 max-w-[15ch] display-hero">
          Money that moves as fast as you do
        </h1>

        <p className="mx-auto mt-7 max-w-[50ch] text-[17px] leading-relaxed text-muted">
          Send to any bank in seconds, clear every bill from one screen, and
          turn the giftcards sitting in your inbox into spendable naira.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
          <GetAppButton size="lg">Create a free account</GetAppButton>
          <TextLink href="#transfers">
            See how sending works
          </TextLink>
        </div>

        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3">
          {PROMISES.map((p) => (
            <li key={p} className="flex items-center gap-2 text-[14px] text-muted">
              <Check className="h-4 w-4 shrink-0 text-brand" />
              {p}
            </li>
          ))}
        </ul>
      </Container>

      {/* Full-bleed art block under the statement, as the reference does. */}
      <Container className="mt-14">
        <PhotoPanel
          src="/img/customer-hand.jpg"
          sizes="100vw"
          className="px-6 py-14 sm:py-16"
        >
          <div className="flex justify-center">
            <PersonalPhone className="animate-float" />
          </div>
        </PhotoPanel>
      </Container>
    </section>
  );
}

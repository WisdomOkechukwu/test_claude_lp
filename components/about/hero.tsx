import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";

export function AboutHero() {
  return (
    <section className="overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
      <Container className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          About Tribe
        </p>

        <h1 className="display mx-auto mt-7 max-w-[15ch] display-hero">
          Built in Port Harcourt, for the way money moves here
        </h1>

        <p className="mx-auto mt-7 max-w-[54ch] text-[17px] leading-relaxed text-muted">
          Tribe exists because the rails Nigerian businesses depend on were an
          afterthought for everyone else. We started with those rails first, and
          built everything else on top of them.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="#values" size="lg">
            What we hold to
          </Button>
          <Button href="/careers" variant="secondary" size="lg">
            Work with us
          </Button>
        </div>
      </Container>

      <Container className="mt-14">
        <PhotoPanel
          src="/img/storefront.jpg"
          sizes="100vw"
          className="h-[320px] sm:h-[420px]"
        >
          <blockquote className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
            <p className="heading mx-auto max-w-[40ch] text-center text-[clamp(1.25rem,2.6vw,2rem)] leading-snug text-white">
              &ldquo;A payment that takes three working days is not a payment.
              It is a promise with paperwork.&rdquo;
            </p>
            <footer className="mt-4 text-center text-[13px] font-semibold text-white/75">
              From the note that started Tribe, 2023
            </footer>
          </blockquote>
        </PhotoPanel>
      </Container>
    </section>
  );
}

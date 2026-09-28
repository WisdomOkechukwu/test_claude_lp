import { Button, TextLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";

export function SecurityHero() {
  return (
    <section className="overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20">
      <Container className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Security overview
        </p>

        <h1 className="display mx-auto mt-7 max-w-[15ch] display-hero">
          How Tribe keeps money where you sent it
        </h1>

        <p className="mx-auto mt-7 max-w-[56ch] text-[17px] leading-relaxed text-muted">
          What follows is a description of practices — how money moves, who can
          move it, what is stored, and what to do if you find a hole. There are
          no certifications listed here and no regulator named, because naming
          one would be a claim rather than an explanation.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
          <Button href="#rails" size="lg">
            Start with the rails
          </Button>
          <TextLink href="/developers#security">
            Security notes for engineers
          </TextLink>
        </div>
      </Container>

      <Container className="mt-14">
        <PhotoPanel
          src="/img/workspace.jpg"
          sizes="(max-width: 1100px) 100vw, 1100px"
          scrim="deep"
          className="mx-auto flex aspect-[16/7] w-full max-w-[1100px] items-end px-6 py-8 sm:px-10 sm:py-10"
          imageClassName="object-center"
        >
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/85 sm:text-[17px]">
            Every naira that moves through Tribe leaves a record naming who
            raised it, who approved it and which rail carried it.
          </p>
        </PhotoPanel>
      </Container>
    </section>
  );
}

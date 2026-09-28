import { Button } from "@/components/ui/button";
import { APP_STORE, PLAY_STORE } from "@/components/ui/app-links";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";
import { PhoneMock } from "@/components/mockups/phone-mock";

/* App-store badges, drawn rather than fetched — keeps the page asset-free. */
function StoreBadge({
  store,
  href,
}: {
  store: "apple" | "google";
  href: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex h-[54px] items-center gap-3 rounded-xl bg-ink px-4 text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {store === "apple" ? (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.7c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.6-1.9-1.5-.2-3 .9-3.7.9s-2-.9-3.2-.9c-1.7 0-3.2 1-4 2.5-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.5 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8s2.2-1.2 3-2.4c.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-1-2.4-3.9ZM14 4.8c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.9-1 3 1 .1 2.1-.5 2.8-1.4Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path d="M3.6 2.4 14 12 3.6 21.6a1.6 1.6 0 0 1-.6-1.3V3.7c0-.5.2-1 .6-1.3Z" fill="#B075E0" />
          <path d="m14 12 3.1-2.9 3.3 1.9c.9.5.9 1.5 0 2l-3.3 1.9L14 12Z" fill="#FFB38A" />
          <path d="M3.6 2.4c.4-.3 1-.4 1.5-.1l12 6.8L14 12 3.6 2.4Z" fill="#8E3FD0" />
          <path d="M3.6 21.6 14 12l3.1 2.9-12 6.8c-.5.3-1.1.2-1.5-.1Z" fill="#FF631C" />
        </svg>
      )}
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-80">
          {store === "apple" ? "Download on the" : "Get it on"}
        </span>
        <span className="block text-[17px] font-semibold">
          {store === "apple" ? "App Store" : "Google Play"}
        </span>
      </span>
    </a>
  );
}

export function EaseOfUse() {
  return (
    /* `#download` in the nav points here — the store badges live in this
       section, so this is where "Download the app" has to land. */
    <Band id="download">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            {/* The phone sits to one side rather than dead centre: centred, it
                covered the photograph almost entirely and the panel read as a
                mockup on a purple field. The panel has to stay taller than the
                phone — anything squarer clips it, since PhoneMock is 9:18.5. */}
            <PhotoPanel
              src="/img/operator-phone.jpg"
              sizes="(max-width: 1024px) 90vw, 600px"
              scrim="soft"
              className="flex items-center justify-center px-6 py-10 sm:aspect-[5/6] sm:justify-end sm:px-9 sm:py-0"
            >
              <PhoneMock className="animate-float w-full max-w-[250px]" />
            </PhotoPanel>
          </div>

          <div>
            <Eyebrow className="text-brand">Operations</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Run the whole operation from your phone
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg text-muted">
              Check what came in, approve what goes out, and see exactly when
              the bank will credit you — from a queue at the airport or the back
              of your warehouse. Transfers move on NIP in seconds, and every
              naira is accounted for before you confirm.
            </p>
            <Button href="#how-it-works" size="lg" className="mt-9">
              Create an account to start
            </Button>
            <div className="mt-8 flex flex-wrap gap-4">
              <StoreBadge store="apple" href={APP_STORE} />
              <StoreBadge store="google" href={PLAY_STORE} />
            </div>
          </div>
        </div>
      </Container>
    </Band>
  );
}

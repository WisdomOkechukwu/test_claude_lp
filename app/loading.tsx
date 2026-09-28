import { SiteNav } from "@/components/site-nav";
import { Container } from "@/components/ui/section";

/* Shown while a client-side navigation fetches the next route's payload.

   Worth being clear about how narrow that window is, because it is easy to
   assume this shows far more often than it does. Every route is statically
   prerendered with no data fetching, so it never runs on a cold load — there
   is nothing to suspend on. Next then prefetches the *full* payload for all
   three routes as soon as their links are in view, so a click after that has
   landed is served from the router cache with no request at all.

   What is left is one real case, and it was verified rather than assumed:
   hydration has finished, the prefetch is still in flight, and the connection
   is slow. Click before hydration and the browser does a full page load
   instead; click after the prefetch and it is instant.

   The real nav renders rather than a placeholder for it, so the header does
   not flash or move when the page arrives. The bars below trace the hero: a
   pill, three heading lines, two of body, the buttons, and the outcome row. */

function Bar({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg bg-line ${className}`} />;
}

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <main className="flex-1" aria-busy="true" aria-live="polite">
        {/* One label for assistive tech; the bars themselves are noise. */}
        <span className="sr-only">Loading</span>

        <Container className="pt-14 pb-20 sm:pt-20 sm:pb-28" aria-hidden="true">
          <div className="flex flex-col items-center">
            <Bar className="h-7 w-[190px] rounded-full" />

            <div className="mt-9 flex w-full flex-col items-center gap-3">
              <Bar className="h-[clamp(2.75rem,6vw,4.75rem)] w-[min(100%,620px)]" />
              <Bar className="h-[clamp(2.75rem,6vw,4.75rem)] w-[min(100%,540px)]" />
              <Bar className="h-[clamp(2.75rem,6vw,4.75rem)] w-[min(100%,380px)]" />
            </div>

            <div className="mt-10 flex w-full flex-col items-center gap-2.5">
              <Bar className="h-4 w-[min(100%,460px)]" />
              <Bar className="h-4 w-[min(100%,400px)]" />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <Bar className="h-[52px] w-[210px] rounded-full" />
              <Bar className="h-[52px] w-[150px] rounded-full" />
            </div>

            <div className="mt-14 grid w-full max-w-3xl gap-8 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2.5">
                  <Bar className="h-6 w-[130px]" />
                  <Bar className="h-3.5 w-full max-w-[190px]" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

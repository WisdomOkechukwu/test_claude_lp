import { GetAppButton } from "@/components/ui/get-app-button";
import { Container, Eyebrow } from "@/components/ui/section";
import { PhotoPanel } from "@/components/ui/photo";
import { BillerWall } from "@/components/mockups/billers";

/* No longer a client component: the wall here is a display of who we pay, not
   a picker. The receipt it used to drive ("MTN · 240 staff lines · ₦82,000")
   was a business figure sitting on a consumer page, and selecting a provider on
   a marketing page never led anywhere — paying one happens in the app. */
export function CustomerBills() {
  return (
    <section id="bills" className="pb-18 sm:pb-24 lg:pb-28">
      <Container>
        <PhotoPanel
          src="/img/workspace.jpg"
          sizes="100vw"
          className="px-6 py-24 sm:py-32"
        >
          <p className="display mx-auto max-w-[22ch] text-center display-section text-white">
            Every bill, gone before the light does
          </p>
        </PhotoPanel>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow className="text-brand">Bills and airtime</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Pay utilities with ease
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg text-muted">
              Airtime, data, electricity, cable and internet — all from the same
              balance, all in two taps. Save a meter number once and it is there
              forever after. Tokens arrive in the app and by SMS, and every
              receipt stays where you can find it.
            </p>

            <div className="mt-10">
              <GetAppButton size="lg">Pay a bill in the app</GetAppButton>
            </div>
          </div>

          <div>
            <BillerWall />
          </div>
        </div>
      </Container>
    </section>
  );
}

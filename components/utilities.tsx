import { Button, TextLink } from "@/components/ui/button";
import { Band, Container, Eyebrow } from "@/components/ui/section";
import { BulkRun } from "@/components/mockups/bulk-run";
import { Check } from "@/components/ui/icons";

/* This section used to be a full-bleed photograph of a warehouse with "Two
   hundred payments, one click" over it, a paragraph, and a row of biller chips
   whose receipt floated at the top of the section. It asserted scale without
   showing any, and the one interactive thing in it gave feedback off screen.

   What a bulk run actually is: pick who you are paying and what they get, add
   the numbers, send it, and read the per-line outcome. That is what the section
   shows now. The photograph is gone rather than relocated; the run is the
   picture. */
const POINTS = [
  "Pick the provider and the bundle, then add who gets it",
  "Up to 5,000 lines in a run, from the dashboard or one API call",
  "A line that cannot be paid refunds itself — no part-paid run to unpick",
  "One receipt per run, one entry per line for your books",
];

export function Utilities() {
  return (
    <Band id="disbursement">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <BulkRun />
          </div>

          <div className="order-1 lg:order-2">
            <Eyebrow className="text-brand">Bulk disbursement</Eyebrow>
            <h2 className="heading max-w-[22ch] display-section">
              Two hundred payments, one send, one receipt
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg text-muted">
              Airtime for a field team of two hundred, electricity for three
              warehouses, cable for every branch. Choose the bundle, add the
              numbers, send it once — Tribe fans it out line by line, paying
              what it can, refunding what it cannot, and telling you which was
              which before anyone has to ask.
            </p>

            <ul className="mt-8 space-y-2.5">
              {POINTS.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button href="#how-it-works" size="lg">
                Create an account to start
              </Button>
              <TextLink href="/developers/api#disbursement">
                See how our disbursement API works
              </TextLink>
            </div>
          </div>
        </div>
      </Container>
    </Band>
  );
}

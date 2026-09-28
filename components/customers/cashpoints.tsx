import { Container, Eyebrow } from "@/components/ui/section";
import { GetAppButton } from "@/components/ui/get-app-button";
import { TextLink } from "@/components/ui/button";
import { CashpointSend } from "@/components/mockups/cashpoint-send";
import { ArrowUp, Clock, Lock, Share, Users } from "@/components/ui/icons";

/* A cashpoint is a PIN worth money, not an account number — so the section is
   built around the sequence, not around a feature list. Three steps across the
   top, the thing itself underneath.

   The section used to describe cashpoints as a user's permanent identifier,
   which was wrong: nobody has "a cashpoint", you *make* one, worth a fixed
   amount, and whoever holds the digits redeems it. */
const STEPS = [
  {
    n: "01",
    icon: ArrowUp,
    title: "Set an amount aside",
    body: "Say what it is worth. That much is held out of your balance and nothing else moves until somebody redeems it.",
  },
  {
    n: "02",
    icon: Share,
    title: "Send the PIN, any way you like",
    body: "Twenty digits. WhatsApp them, text them, write them on paper. The recipient does not need to be in your contacts — or on Tribe yet.",
  },
  {
    n: "03",
    icon: Users,
    title: "They redeem it",
    body: "They type the digits into Tribe and the money is theirs. Once. A redeemed cashpoint closes itself and you get the receipt.",
  },
];

const GUARDS = [
  {
    icon: Lock,
    title: "One redemption, then it is closed",
    body: "There is no second use and no partial redemption. A PIN that has been spent is dead the moment it is spent.",
  },
  {
    icon: Clock,
    title: "Unredeemed, it comes back",
    body: "Nobody claims it in seven days and the amount returns to your balance. You can also cancel one yourself while it is still unredeemed.",
  },
];

export function CustomerCashpoints() {
  return (
    <section id="cashpoints" className="scroll-mt-24 pb-18 sm:pb-24 lg:pb-28">
      <Container>
        <div className="max-w-[52ch]">
          <Eyebrow className="text-brand">Cashpoints</Eyebrow>
          <h2 className="heading display-section">
            Send money to someone who is not on Tribe yet
          </h2>
          <p className="mt-6 text-lg text-muted">
            A cashpoint is a PIN worth a fixed amount. You make one, send the
            digits to whoever you like, and they redeem it — no account number,
            no bank name, no waiting for them to sign up first. It is cash in an
            envelope, with a receipt.
          </p>
        </div>

        {/* The sequence across the top, because a cashpoint only makes sense as
            three steps in order. */}
        <ol className="mt-12 grid gap-8 border-y border-line py-10 lg:grid-cols-3 lg:gap-10">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <li key={n} className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="display tnum text-[1.5rem] text-brand">{n}</span>
              </div>
              <h3 className="heading mt-4 text-lg">{title}</h3>
              <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-muted">
                {body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h3 className="heading max-w-[24ch] text-2xl">
              What stops it going wrong
            </h3>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted">
              A code that carries money has to fail safe. These two rules are the
              whole of it — everything else is the same balance and the same
              receipts you already have.
            </p>

            <dl className="mt-8 space-y-6">
              {GUARDS.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <dt className="flex items-center gap-4 font-semibold">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="h-5 w-5" />
                    </span>
                    {title}
                  </dt>
                  <dd className="mt-1 max-w-[44ch] pl-[60px] text-[15px] leading-relaxed text-muted">
                    {body}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <GetAppButton size="lg">Make a cashpoint</GetAppButton>
              <TextLink href="/customers#transfers">
                Or send straight to a bank
              </TextLink>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <CashpointSend />
          </div>
        </div>
      </Container>
    </section>
  );
}

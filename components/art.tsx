import { BRANDS, BrandLogo, type BrandKey } from "@/components/brand-logos";

/* Hand-built vector artwork. Everything here is inline SVG + CSS gradients —
   no raster assets, no network. Gradient ids are namespaced per-drawing so two
   drawings can coexist on a page.

   The globes that used to live here were removed deliberately: Tribe settles on
   Nigerian rails only, and a spinning world read as a cross-border product. */

/* The coin gradient is defined once per parent SVG and referenced by id, so a
   page with several drawings never emits a duplicate id. */
function CoinGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFE082" />
      <stop offset="42%" stopColor="#F5B92E" />
      <stop offset="100%" stopColor="#C97A12" />
    </linearGradient>
  );
}

function Coin({
  fill,
  x,
  y,
  r,
  rotate = 0,
  edge = false,
}: {
  fill: string;
  x: number;
  y: number;
  r: number;
  rotate?: number;
  edge?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {/* An "edge-on" coin is a thin ellipse — sells the tumbling motion. */}
      <ellipse
        rx={edge ? r * 0.16 : r}
        ry={r}
        fill={`url(#${fill})`}
        stroke="#A75F0B"
        strokeWidth={r * 0.05}
      />
      {!edge && (
        <>
          <ellipse
            rx={r * 0.78}
            ry={r * 0.78}
            fill="none"
            stroke="#B86D0D"
            strokeWidth={r * 0.06}
            opacity="0.55"
          />
          <text
            y={r * 0.26}
            textAnchor="middle"
            fontSize={r * 0.82}
            fontWeight="800"
            fill="#8A4F06"
            fontFamily="var(--font-poppins), system-ui, sans-serif"
          >
            ₦
          </text>
        </>
      )}
    </g>
  );
}

/* ---------- Coin trail for the dark mission banner ---------- */

export function CoinTrail({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 200"
      className={className}
      role="img"
      aria-label="A trail of naira coins"
    >
      <defs>
        <CoinGradient id="trail-gold" />
        <linearGradient id="trail-band" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6A0DAD" />
          <stop offset="55%" stopColor="#FF631C" />
          <stop offset="100%" stopColor="#6A0DAD" />
        </linearGradient>
      </defs>

      {/* A single sweeping band carries the eye across the coins. */}
      <path
        d="M20 150C110 150 130 60 230 60s120 90 210 90"
        fill="none"
        stroke="url(#trail-band)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.55"
      />

      <Coin fill="trail-gold" x={230} y={62} r={38} rotate={-10} />
      <Coin fill="trail-gold" x={150} y={96} r={28} rotate={14} />
      <Coin fill="trail-gold" x={310} y={98} r={30} rotate={-16} />
      <Coin fill="trail-gold" x={86} y={140} r={24} rotate={8} edge />
      <Coin fill="trail-gold" x={382} y={134} r={22} rotate={-6} edge />
    </svg>
  );
}

/* ---------- Padlock for the security section ---------- */

export function Padlock({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 320"
      className={className}
      role="img"
      aria-label="A padlock"
    >
      <defs>
        <linearGradient id="lock-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A855E8" />
          <stop offset="45%" stopColor="#6A0DAD" />
          <stop offset="100%" stopColor="#2C0A4A" />
        </linearGradient>
        <linearGradient id="lock-shackle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C58BF2" />
          <stop offset="100%" stopColor="#55099B" />
        </linearGradient>
        <filter id="lock-grain">
          <feTurbulence baseFrequency="0.8" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g transform="rotate(-12 150 160)">
        <path
          d="M78 118V86a72 72 0 0 1 144 0v32h-38V86a34 34 0 0 0-68 0v32H78Z"
          fill="url(#lock-shackle)"
        />
        <rect x="46" y="112" width="208" height="168" rx="26" fill="url(#lock-body)" />
        {/* A single orange bar picks up the second brand colour. */}
        <rect x="46" y="243" width="208" height="12" fill="#FF631C" opacity="0.9" />
        <rect
          x="46"
          y="112"
          width="208"
          height="168"
          rx="26"
          fill="#fff"
          filter="url(#lock-grain)"
        />
        <circle cx="150" cy="182" r="20" fill="#1E0433" opacity="0.9" />
        <path d="M143 190h14l7 44h-28l7-44Z" fill="#1E0433" opacity="0.9" />
      </g>
    </svg>
  );
}

/* ---------- Gift card faces ---------- */

/* Each card is the brand's own mark on the brand's own colour, which is what a
   gift card actually looks like and what a customer scanning this rail is
   looking for. The marks and colours come from `components/brand-logos.tsx`.

   The trademarks belong to their owners. They appear to identify the cards
   Tribe converts — the same nominative use the copy already makes, and the
   same thing `components/disclaimer.tsx` disclaims in words.

   Foreground is whichever of white or ink clears 4.5:1 on that brand colour;
   it is recorded per brand rather than chosen here, because Spotify green and
   iTunes pink both fail white. Do not hardcode white text on these. */

export function GiftCardFace({
  brandKey,
  denomination,
  className = "",
}: {
  brandKey: BrandKey;
  /* Only the converter sets this — the marquee is a list of brands we accept,
     not a list of quoted values. */
  denomination?: string;
  className?: string;
}) {
  const brand = BRANDS[brandKey];
  const fg = brand.ink === "white" ? "#ffffff" : "var(--color-ink)";

  return (
    /* Two elements on purpose. Container query units resolve against the
       nearest *ancestor* container, never the element that declares the
       container itself — putting `container-type` and `font-size: cqw` on the
       same node made the units fall back to the viewport, so the rail cards
       rendered with 29px text. The outer div is the container; the inner one
       does the sizing. */
    <div
      className={`relative isolate aspect-[1.6/1] overflow-hidden rounded-[8%] ${className}`}
      style={{
        backgroundColor: brand.hex,
        color: fg,
        containerType: "inline-size",
      }}
    >
      {/* A single diagonal sheen. One gradient, no blur — twenty of these
          scroll forever in the rail. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.14) 50%, transparent 62%)",
        }}
      />

      <div
        className="relative flex h-full flex-col justify-between p-[7%]"
        style={{ fontSize: "7.5cqw" }}
      >
        <div className="flex justify-end">
          <BrandLogo brandKey={brandKey} className="h-[1.5em] w-[1.5em] shrink-0" />
        </div>

        <div className="flex items-end justify-between gap-[0.6em]">
          <div className="min-w-0">
            <p className="truncate text-[0.82em] font-bold leading-tight">
              {brand.name}
            </p>
            {denomination && (
              <p className="display tnum mt-[0.1em] text-[1.25em] leading-none">
                {denomination}
              </p>
            )}
          </div>
          {/* Full strength, not dimmed. At 0.85 opacity this dropped to
              3.61:1 on eBay red, 3.69:1 on Netflix red and 4.02:1 on
              PlayStation blue — the three mid-tone brand colours have no
              headroom to give away. */}
          <span className="shrink-0 whitespace-nowrap pb-[0.15em] text-[0.4em] font-semibold uppercase tracking-[0.14em]">
            Gift card
          </span>
        </div>
      </div>
    </div>
  );
}

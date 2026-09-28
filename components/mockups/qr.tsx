/* A drawn NQR code.

   Not a real encoder — an actual NQR payload is an EMVCo TLV string and a
   Reed-Solomon matrix, which is a library, and CLAUDE.md rules libraries out.
   What this needs to do is read as a QR code at a glance, so the modules come
   from a tiny deterministic hash of the payload: the same link always draws the
   same pattern, server and client, which is the hydration rule in this folder.

   The three finder squares and the quiet zone are what make a grid of dots read
   as a QR rather than as noise, so those are positioned properly even though
   the data modules are decorative. */

const SIZE = 25;

/* xorshift, seeded from the payload. Deterministic by construction — no
   Math.random(), which would differ between the two render passes. */
function modules(payload: string): boolean[][] {
  let seed = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    seed ^= payload.charCodeAt(i);
    seed = Math.imul(seed, 16777619) >>> 0;
  }

  const next = () => {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >> 17;
    seed ^= seed << 5; seed >>>= 0;
    return seed / 0xffffffff;
  };

  const grid: boolean[][] = [];
  for (let y = 0; y < SIZE; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < SIZE; x++) row.push(next() > 0.52);
    grid.push(row);
  }
  return grid;
}

/* The corner where a finder square and its separator live. */
function inFinder(x: number, y: number): boolean {
  const corner = (cx: number, cy: number) =>
    x >= cx && x < cx + 8 && y >= cy && y < cy + 8;
  return corner(0, 0) || corner(SIZE - 8, 0) || corner(0, SIZE - 8);
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width={7} height={7} rx={1} fill="currentColor" />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.5} fill="currentColor" />
    </>
  );
}

export function QrCode({
  payload,
  className = "",
}: {
  payload: string;
  className?: string;
}) {
  const grid = modules(payload);

  return (
    <svg
      viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
      className={`text-ink ${className}`}
      role="img"
      aria-label="An NQR code. The link beside it does the same thing."
    >
      <rect x={-1} y={-1} width={SIZE + 2} height={SIZE + 2} fill="#fff" />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on && !inFinder(x, y) ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="currentColor"
            />
          ) : null,
        ),
      )}
      <Finder x={0} y={0} />
      <Finder x={SIZE - 7} y={0} />
      <Finder x={0} y={SIZE - 7} />
    </svg>
  );
}

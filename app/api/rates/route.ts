import { NextResponse } from "next/server";
import { parseRates, readBoard, writeBoard } from "@/lib/rates";

/* The gift card rate board.
 *
 *   GET  /api/rates   read the current board — no auth, it is public pricing
 *   POST /api/rates   push new rates from your backend — bearer token
 *
 * This is the one dynamic route on an otherwise fully prerendered site. Every
 * page stays static; only this handler runs per request.
 *
 * Push:
 *
 *   curl -X POST https://tribe.ng/api/rates \
 *     -H "Authorization: Bearer $TRIBE_RATES_TOKEN" \
 *     -H "Content-Type: application/json" \
 *     -d '{"rates":[{"brand":"steam","region":"US","rate":1420}]}'
 *
 * Read:
 *
 *   curl https://tribe.ng/api/rates
 *
 * Set TRIBE_RATES_TOKEN in the environment. Without it POST is refused
 * outright rather than left open — an unset secret must never mean "no secret
 * required", which is how a write endpoint ends up public.
 */

/* Never prerendered, never cached: the whole point is that the answer changes. */
export const dynamic = "force-dynamic";

function cors(res: NextResponse): NextResponse {
  /* The page fetches this from the same origin, so no cross-origin grant is
     given. A backend pushing to it is server-to-server and needs none. */
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function GET() {
  const board = readBoard();

  return cors(
    NextResponse.json({
      rates: board.rates,
      updated_at: board.updated_at,
      source: board.source,
      currency: "NGN",
    }),
  );
}

export async function POST(request: Request) {
  const expected = process.env.TRIBE_RATES_TOKEN;

  if (!expected) {
    return cors(
      NextResponse.json(
        {
          error: {
            code: "not_configured",
            message: "TRIBE_RATES_TOKEN is not set on the server, so pushes are refused.",
          },
        },
        { status: 503 },
      ),
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  /* Length-safe comparison. Not constant-time — Node's timingSafeEqual needs
     equal-length buffers and the length itself leaks — but the token is a
     random secret, not a guessable password, so the practical risk is nil and
     the failure mode of getting the buffer dance wrong is worse. */
  if (!token || token !== expected) {
    return cors(
      NextResponse.json(
        {
          error: {
            code: "unauthenticated",
            message: "Send the push token as `Authorization: Bearer <token>`.",
          },
        },
        { status: 401 },
      ),
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return cors(
      NextResponse.json(
        { error: { code: "invalid_request", message: "Body must be valid JSON." } },
        { status: 400 },
      ),
    );
  }

  const parsed = parseRates(body);
  if (!parsed.ok) {
    return cors(
      NextResponse.json(
        { error: { code: "invalid_request", message: parsed.reason } },
        { status: 400 },
      ),
    );
  }

  /* Stamped here rather than taken from the body: a timestamp the pusher
     controls is a timestamp that can claim to be newer than it is. */
  const board = writeBoard(parsed.rates, new Date());

  return cors(
    NextResponse.json({
      accepted: board.rates.length,
      rates: board.rates,
      updated_at: board.updated_at,
      source: board.source,
      currency: "NGN",
    }),
  );
}

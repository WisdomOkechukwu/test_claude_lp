import { ImageResponse } from "next/og";

export const alt =
  "Tribe — collections, settlement and loan recovery for Nigerian businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori renders this outside the document, so the `@theme` custom properties
   in globals.css are not reachable and the values have to be inlined. These
   are the same tokens — keep them in step with `--color-*` if the brand moves.

   Deliberately plain type: pulling Poppins in would mean fetching a font over
   the network during the build, which is a new way for the build to fail for
   an image most people never look at closely. */
const BRAND = "#6a0dad";
const PLUM = "#1e0433";
const ACCENT = "#ff631c";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PLUM,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* A single orange rule along the top, the way the accent is used on
            the site itself — a mark, not a surface. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 12,
            background: ACCENT,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 18,
              background: BRAND,
              color: "#fff",
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            T
          </div>
          <div style={{ color: "#fff", fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
            Tribe
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#fff",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2.4,
              maxWidth: 900,
            }}
          >
            Everything your business needs to move money
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 30, maxWidth: 860 }}>
            Collections, same-day settlement and loan recovery on Nigerian rails.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 28, height: 4, background: ACCENT }} />
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 22 }}>
            A demonstration product — not a live financial service
          </div>
        </div>
      </div>
    ),
    size,
  );
}

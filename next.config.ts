import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* The optimizer was serving WebP only. AVIF first typically takes another
       20-30% off, and Next falls back to WebP for anything that cannot take
       it, so there is no browser to exclude. */
    formats: ["image/avif", "image/webp"],

    /* Optimized derivatives were going out with `max-age=14400` — four hours
       for images that are content-hashed build artefacts and never change
       under a given URL. A year is the honest number. */
    minimumCacheTTL: 31_536_000,
  },

  /* Deliberately NOT configured here:

     - Cache headers for `/_next/static`. Next already sends
       `public, max-age=31536000, immutable` on those, so a `headers()` entry
       would be duplicated config that drifts.
     - Brotli. `next start` compresses with gzip only, and returns the full
       uncompressed payload when a client offers `br` alone. That has to be
       solved at the nginx layer — see the deployment note in CLAUDE.md. */
};

export default nextConfig;

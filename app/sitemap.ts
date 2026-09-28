import type { MetadataRoute } from "next";

/* The real routes. `metadataBase` in app/layout.tsx is the single source
   of the origin — do not hardcode the host here, or the two drift apart the
   first time this moves domain.

   No `lastModified`: it would either be a build timestamp, which tells a
   crawler the page changed when it did not, or a hand-maintained date that
   goes stale. Omitting it is more honest than either. */
const BASE = "https://tribe.ng";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/customers`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/developers`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/developers/api`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/developers/bank-codes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/security`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/careers`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/status`, changeFrequency: "daily", priority: 0.5 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.5 },
  ];
}

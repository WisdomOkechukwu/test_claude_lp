import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Next's image optimizer endpoint serves derivatives of files that are
         already crawlable at their own URLs. Indexing both wastes budget. */
      disallow: "/_next/image",
    },
    sitemap: "https://tribe.ng/sitemap.xml",
  };
}

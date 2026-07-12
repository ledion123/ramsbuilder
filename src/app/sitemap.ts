import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ramsgen.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
{ url: `${SITE}/privacy`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE}/terms`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/features", "/privacy", "/login"],
      // Everything else is the signed-in app.
      disallow: [
        "/dashboard",
        "/accounts",
        "/net-worth",
        "/cash-flow",
        "/objectives",
        "/loans",
        "/currencies",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

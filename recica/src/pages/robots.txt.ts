import type { APIRoute } from "astro";

import { siteConfig } from "@/lib/site-content";

export const GET: APIRoute = () => {
  const indexingEnabled = import.meta.env.PUBLIC_INDEXING_ENABLED === "true";
  const policy = indexingEnabled ? "Allow: /" : "Disallow: /";
  const body = [
    "User-agent: *",
    policy,
    "",
    `Sitemap: ${new URL("/sitemap-index.xml", siteConfig.origin).toString()}`,
    `Host: ${new URL(siteConfig.origin).host}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { CONTENT_UPDATED, ROUTES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : ["/aviso-legal", "/privacidad", "/cookies"].includes(path) ? 0.3 : 0.8,
  }));
}

import type { MetadataRoute } from "next";
import { brands } from "@/data/work";

const SITE_URL = "https://franciscoalencar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/ai",
    "/branded",
    "/entertainment",
    "/meet",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  // Films live inline on each brand page (no dedicated URL per film),
  // so only brand-level routes are in the sitemap. Individual films
  // are indexed via VideoObject JSON-LD on each brand page.
  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/branded/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...brandRoutes];
}

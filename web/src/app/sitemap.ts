import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/projects",
  "/experience",
  "/resume",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: append published blog post URLs once they're stored in the database.
  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}

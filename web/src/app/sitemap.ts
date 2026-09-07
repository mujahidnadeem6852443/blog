import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";
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

async function getPublishedSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.posts as Array<{ slug: string }>).map((post) => post.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedSlugs();
  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
    })),
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: new Date(),
    })),
  ];
}

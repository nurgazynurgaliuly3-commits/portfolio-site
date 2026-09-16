import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PROJECTS } from "@/data/projects";
import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({ url: `${SITE_URL}/${locale}` });
    entries.push({ url: `${SITE_URL}/${locale}/projects` });
    entries.push({ url: `${SITE_URL}/${locale}/blog` });
    entries.push({ url: `${SITE_URL}/${locale}/about` });
    entries.push({ url: `${SITE_URL}/${locale}/contact` });

    for (const p of PROJECTS) {
      entries.push({ url: `${SITE_URL}/${locale}/projects/${p.slug}` });
    }

    const posts = await getAllPosts(locale);
    for (const post of posts) {
      entries.push({ url: `${SITE_URL}/${locale}/blog/${post.slug}` });
    }
  }

  return entries;
}
